jquery.formatNumber-modified
=============================

Basado en el plugin de RaphaelDDL, pero con modificaciones para ajustar a un proyecto en el que necesitaba separador de miles y decimales, configurable. Dicha configuración se setea en la sessionStorage y para aplicar el plugin luego de setearlo se invoca a la función de jquery .darFormato() y .darFormatoInputs(), dependiendo del caso, estas estan en el archivo functions.js , ademas se agregan validaciones de jquery valdiator para separadores decimales con 'coma' , además de un metodo .toDouble() en el prototype de String , ya que un number en javascript siempre llevará 'punto' , aunque en nuestros formularios querramos mostrarlos con 'coma'. Eso, algún día arreglare este readme. See u later!
