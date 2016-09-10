from django.db import models
from django.contrib import admin

# Create your models here.
class Country(models.Model):
	name = models.CharField('Название страны', max_length = 32)
	icon = models.CharField('Иконка страны', max_length = 128, blank = True)
	tag = models.CharField('Тег', max_length = 32)
	url = models.CharField('Ссылка', max_length = 128, blank = True)

	class Meta():
		verbose_name = 'Страна'
		verbose_name_plural = 'Страны'

	def __str__(self):
		return self.name

class CountryAdmin(admin.ModelAdmin):
	list_display = ('id', 'name')