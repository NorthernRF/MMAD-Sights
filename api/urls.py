from django.conf.urls import url
from . import views

urlpatterns = [
	url('^m', views.SightsAPI.as_view()),
]