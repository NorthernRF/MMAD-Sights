from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.reverse import reverse
from rest_framework.response import Response
from rest_framework.views import APIView
from application.models import *
from bs4 import BeautifulSoup as bs
import urllib.request as urllib
from application.models import *

# Create your views here.
class SightsAPI(APIView):	
	def get(self, request, format = None):
		data = request.GET
		method = data.get("m", False)

		if method == "setlist":
			page_url = "http://discoveric.ru/"
			page = urllib.urlopen(page_url)
			document = bs(page, 'html.parser')

			# country_list = document.find("select", {"class": "cselect"})
			country_list = document.select('.cselect option')
			print(country_list[0]['value'])
			for country in country_list[1:]:
				icon = 'http://discoveric.ru' + country['data-image']
				title = country.decode_contents()
				country_url = country['value']
				url = 'http://discoveric.ru/mesta' + country_url[7:]

				c = Country()				
				c.name = title
				c.icon = icon
				c.tag = '3'
				c.url = url

				c.save()

		elif method == 'search':
			countries = []
			query = data.get("q", False)
			if query:
				countries_list = Country.objects.filter(name__icontains = query.capitalize(), tag = 3)
				for c in countries_list:
					countries.append({
						"id": c.id,
						"title": c.name,
						"icon": c.icon,
					})
			return Response(countries)

		elif method == 'cities':
			cities = []
			country_id = data.get('id', False)
			if country_id:
				country = Country.objects.get(pk = int(country_id), tag = 3)
				page_url = country.url
				page = urllib.urlopen(page_url)
				document = bs(page, 'html.parser')
				cities_parent = document.select('.filter_cont')[0]
				cities_list = cities_parent.select('span a')[1:]


				for city in cities_list:
					name = city.decode_contents()
					url = 'http://discoveric.ru' + city['href']
					cities.append({
						"title": name,
						"url": url,
						"country": country_id,
					})
			return Response({
				"url": page_url,
				"id": country_id,
				"cities": cities
			})

		elif method == 'get':
			sights = []
			sights_url = []
			country_id = data.get('id', False)
			city_url = data.get('url', False)
			city_name = data.get('city', False)
			if city_url:
				country = Country.objects.get(pk = int(country_id), tag = 3)

				page_url = city_url
				page = urllib.urlopen(page_url)
				document = bs(page, 'html.parser')		

				records_list = document.select('.records_list .record')
				i = 0
				for record in records_list:
					record_url = 'http://discoveric.ru' + (record.select('.rimg a'))[0]['href']

					title = (record.select('.noh h2'))[0].decode_contents()
					try:
						city = (record.select('.rtype a'))[0].decode_contents()
					except IndexError:						
						if city_name:
							city = city_name
							if city == 'Все':
								city = False
						else:
							city = False
					category = (record.select('.rtype span'))[0].decode_contents()


					rating_width = (record.select('.stars div'))[0]['style']
					rating_full = 80
					rating_current = int(rating_width[6:-2])
					rating = round(5.0 * (rating_current / rating_full), 1)

					color = 'gray'
					if rating > 0 and rating <= 2.5:
						color = 'red'
					elif rating > 2.5 and rating <= 3.5:
						color = 'orange'
					elif rating > 3.5 and rating <= 4:
						color = 'yellow'
					elif rating > 4 and rating <= 4.5:
						color = 'olive'
					elif rating > 4.5:
						color = 'green'


					sights.append({
						"array-id": i,
						"title": title,
						"country": country.name,
						"flag": country.icon,
						"rating": str(rating),
						"city": city,
						"category": category,
						"color": color,
						"url": record_url
					})
					i += 1

				i = 0
				for s in sights:		
					sight_page = urllib.urlopen(s['url'])
					sight_document = bs(sight_page, 'html.parser')
					sight_document.script.decompose()
					description_string = str(sight_document.find('div', {"class": "record"}))
					desc_start = '</script>\n<!--/noindex-->\n</div>\n'
					desc_end = '<!--noindex-->\n<div class="share">'
					start_position = int(description_string.find(desc_start))
					end_position = int(description_string.find(desc_end))
					desc = str(description_string[start_position + 33:end_position])

					coords_str = ['', '']
					coords_counter = 0
					startPosition = description_string.find('LatLng(') + 6
					j = 0
					while True:
						position = startPosition + j
						if description_string[position] != ')':
							if description_string[position] == ' ':
								coords_counter = 1
							if description_string[position] in ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.']:
								coords_str[coords_counter] += description_string[position]
						else:
							break
						j += 1

					coords = [float(c) for c in coords_str]

					images_list = sight_document.select('.photos li a')
					images = [('http://discoveric.ru' + image['href']) for image in images_list]

					sights[i]['images'] = images
					sights[i]['description'] = desc
					sights[i]['coords'] = coords

					i += 1					
				
			return Response(sights)

		return Response('ok')