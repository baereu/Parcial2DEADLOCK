# Bitácora de decisiones

Ana Sofía García Olivares  
Desarrollo de Aplicaciones Web  
Proyecto Parcial 2: Mi colección de DEADLOCK

# 1. ¿Por qué usar un id único en lugar del nombre?

Porque el nombre es un dato editable, mientras que el identificador debe permanecer estable. Si una persona cambia el nombre de Mina, la aplicación debe seguir sabiendo qué personaje está editando.
Los personajes iniciales tienen identificadores como "deadlock-mina". Al editar se conserva el identificador original y se busca por él para actualizar o eliminar el objeto correcto.

# 2. ¿Guardar todo el arreglo en una clave o un personaje por clave?

La aplicación guarda el arreglo completo en "deadlock-personajes-v3". Antes de almacenarlo, "JSON.stringify()" lo convierte a texto. Al recuperarlo, "JSON.parse()" reconstruye el arreglo para poder recorrerlo y modificarlo.
Así simplifica la lectura, el guardado y la eliminación para una colección pequeña. También evita tener que recorrer todo el almacenamiento buscando claves de personajes.

Lo malo es que se vuelve a escribir el arreglo en cada cambio. Guardar un personaje por clave permitiría actualizar solo ese registro, pero requeriría administrar más claves y reconstruir la colección al iniciar. Para pocos personajes y un proyecto sin backend, basta con la primera opcion. 

# 3. ¿Buscar con cada tecla o al presionar Enter?

La búsqueda escucha el evento "input", actualiza las fichas mientras la persona escribe o pega texto. Se filtra por nombre o rol y se informa cuántas coincidencias existen.
Se convierte el texto a minúsculas y elimina las marcas de acento. Asi el usuario puede encontrar a Seven escribiendo, por ejemplo, "SÉVEN".
Poner Enter reduciría la frecuencia de las búsquedas, pero agregaría un paso a la interacción. No se implementó eso porque la colección es pequeña.

# 4. ¿Qué ocurre si localStorage contiene JSON inválido?

"cargarPersonajes()" utiliza "trycatch" para capturar errores de lectura o conversión. Comprueba que el resultado sea un arreglo y que sus elementos tengan id, nombre y rol tipo texto.

Si se encuentra un error, muestra un aviso y devuelve una lista vacía para poder presentar la interfaz. También pone "almacenamientoValido" en "false", lo que bloquea escrituras posteriores y evita reemplazar silenciosamente los datos dañados. Para la recuperación se requiere restaurar datos válidos y recargar ya que no hay un botón de recuperación automática.

# 5. ¿Qué pasa si la imagen no existe?

La ficha muestra las dos primeras letras del nombre del personaje. "colocarImagen()" crea una imagen y solo reemplaza esas letras cuando ocurre el evento "load". Si ocurre un "error", las inciales van a permanecen visibles.
Asi sera facil identificar al personaje si el enlace está roto o falla la conexión. La validación de URL solo comprueba su formato, no garantiza que la dirección exista.

# 6. ¿Permitir nombres con espacios o duplicados?

Aplicamos "trim()" antes de validar. Por eso un nombre que sean puros espacios queda vacío y se rechaza. Nombre y rol son obligatorios, y los mensajes se muestran junto al campo correspondiente.
Para los duplicados se compara el nombre, sin distinguir mayúsculas ni acentos. Durante una edición se excluye el propio id, para que guardar el mismo nombre no produzca un falso duplicado.

# 7. Si alguien abre el enlace de GitHub Pages, ¿verá mis personajes?

No, quien abra la aplicación sin datos guardados vera los seis ejemplos incluidos en el código. No podra ver las modificaciones realizadas desde el navegador de otra persona.

# 8. Decisiones visuales y organización

Elegí fichas grandes, con una zona separada para la imagen y el botón al final, para facilitar la consulta de los personajes. La cuadrícula cambia de número de columnas según el espacio disponible.
Se buscó que todo este centrado.
Los colores son verde oscuro para fondos, crema para texto y dorado para bordes y acciones destacadas.Con la misma paleta de colores que tiene DEADLOCK. Se dejó la fecha de creación de cada personaje, pero lo quité de la vista.

# 9. Incidencias observadas durante el desarrollo

- **Rutas incorrectas:** el HTML buscaba el JavaScript y el CSS en la raíz, aunque estaban dentro de js y css. Se corrigieron las rutas a "./js/deadlockP.js" y "./css/style.css".
- **Cambios iniciales que no aparecían:** Al editar los roles, descripciones e imágenes en el código no se modificaba la colección ya guardada. Para cargar los nuevos ejemplos durante el desarrollo tuvimos que cambiar la clave de "deadlock-personajes" a "deadlock-personajes-v2" a "deadlock-personajes-v3", dejando la colección anterior bajo su clave previa. No fue necesario cambiar de clave para modificar los colores.
- **Imágenes iniciales vacías:** el bloque que agregaba campos comunes sobrescribía la imagen de cada personaje. Se colocaron primero los valores predeterminados y después "...personaje", para conservar las URLs.
- **Colores anteriores:** una versión anterior del CSS volvió a guardarse sobre el archivo actualizado y se reaplicó la paleta de colores. Se tuvo que sobrescribir.

- Problema con el while en la búsqueda
El documento pide repetir la búsqueda mientras no existan
coincidencias. Si ningún personaje coincide y los datos no cambian,
el ciclo podría repetirse y esto podria bloquear la página.
Por eso utilicé filter(): para que busque cada vez que cambia el texto y si no encuentra coincidencias muestre "Sin resultados".
Una alternativa sería recorrer el arreglo con
un índice y detenerse al llegar al final, aunque no haya resultados.

Le pedi ayudita a chat para ver que ondiux con eso pq m estrese pipipi, pero se resolvió. 
