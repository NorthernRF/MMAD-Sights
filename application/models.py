from django.db import models

# Create your models here.
class Country(models.Model):
	name = models.CharField('Название страны', max_length = 32)
	tag = models.CharField('Тег', max_length = 32)

	class Meta():
		verbose_name = 'Страна'
		verbose_name_plural = 'Страны'

	def __str__(self):
		return self.name