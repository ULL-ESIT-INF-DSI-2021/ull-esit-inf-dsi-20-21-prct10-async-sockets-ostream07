# Desarrollo de Sistemas Informáticos
### Práctica 10. Aplicación de procesamiento de notas de texto

* Autor: Saúl Pérez García
* Correo: alu0101129785@ull.edu.es
* Fecha de entrega: 9-05-2021

### --> Introducción


En esta entrega tomaremos como punto de partida la ya implementada en la [práctica 8](https://ull-esit-inf-dsi-2021.github.io/ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-ostream07/) de esta asignatura  debía de realizarse una aplicación de procesamiento de notas de texto. Esta tenía que permitir realizar una serie de acciones como **añadir, modificar, eliminar, listar y leer** notas de un usuario concreto. Las notas se almacenaban como ficheros JSON en el sistema de ficheros de la máquina que ejecute la aplicación. Además, solo se podía interactuar con la aplicación desde la línea de comandos.

En esta ocasión, se utilizará para escribir un servidor y un cliente haciendo uso de los sockets proporcionados por el ``módulo net`` de ``Node.js``. Las operaciones que podrá solicitar el cliente al servidor deberán ser las mismas que ya implementaron con anterioridad

Para enriquecer el código, se seguirá la metodología TDD para la elaboración de pruebas, y además el código será documentado con typedoc. Como en las prácticas anteriores, se hará uso de **GitHub Actions** que nos va a permitir automatizar, personalizar y ejecutar nuestros flujos de trabajo de desarrollo de software directamente en el repositorio. Finalmente, en la elaboración de esta entrega se respetarán los **principios SOLID** de diseño orientado a objetos.

Antes de continuar, y además de la documentación permitente an mencioando ``módulo net``, así como la clase `EventEmitter`, es conveniente revisar la documentación que se adjunta a continuación sobre los paquetes `chalk` y `yargs` que nos van a permitir dotar de color a nuestras notas y mensajes de acierto o error a o largo del código y también parsear diferentes argumentos pasados a un programa desde la línea de comandos respectivamente.
También podremos encontrar información referida a la **API síncrona de Node.js** para trabajar con el sistema de ficheros, ya que tenemos la intención de guardar el contenido de las notas en diferentes ficheros.

* [Node.js](https://www.npmjs.com/package/@types/node)
* [Módulo net](https://nodejs.org/dist/latest-v16.x/docs/api/net.html)
* [EventEmitter](https://nodejs.org/dist/latest-v16.x/docs/api/events.html#events_class_eventemitter)
* [Chalk](https://www.npmjs.com/package/chalk)
* [Yargs](https://www.npmjs.com/package/yargs)



### --> Objetivos a conseguir

Como se mencionó anteriormente, debemos poder ser capaces de añadir, modificar, eliminar, listar y leer las notas de un usuario concreto, pero además, esta debe cumplir con una serie de requisitos, que vamos a listar:

* Esta aplicación deberá permitir que múltiples usuarios interactúen con ella, pero no simultáneamente, es decir, vamos a ser capaces de guardar las notas de diferentes usuarios.

* Cada nota estará formada, por un **título**, un **cuerpo** y un **color** (rojo, verde, azul o amarillo) aunque también se incluye el negro, y hemos establecido el blanco por defecto debido a la tonalidad oscura del entorno de trabajo.

* Cada usuario tendrá su propia lista de notas, con la que podrá llevar a cabo las siguientes operaciones:

    --> Añadir una nota a la lista. Antes de añadir una nota a la lista se debe comprobar si ya existe una nota con el mismo título. En caso de que así fuera, deberá mostrarse un mensaje de error por la consola. En caso contrario, se añadirá la nueva nota a la lista y se mostrará un mensaje informativo por la consola.

    --> Modificar una nota de la lista. Antes de modificar una nota, previamente se debe comprobar que exista una nota con el título de la nota a modificar en la lista. Si existe, se procede a su modificación y se emite un mensaje informativo por la consola. En caso contrario, debe mostrarse un mensaje de error por la consola.

    --> Eliminar una nota de la lista. Antes de eliminar una nota, previamente se debe comprobar que exista una nota con el título de la nota a eliminar en la lista. Si existe, se procede a su eliminación y se emite un mensaje informativo por la consola. En caso contrario, debe mostrarse un mensaje de error por la consola.

    --> Listar los títulos de las notas de la lista. Los títulos de las notas deben mostrarse por la consola con el color correspondiente de cada una de ellas. Esta funcionalidad se va a satisfacer por medio del paquete chalk.

    --> Leer una nota concreta de la lista. Antes de mostrar el título y el cuerpo de la nota que se quiere leer, se debe comprobar que en la lista existe una nota cuyo título sea el de la nota a leer. Si existe, se mostrará el título y cuerpo de la nota por la consola con el color correspondiente a esta haciendo uso del paquete chalk como en el caso anterior. En caso contrario, se mostrará un mensaje de error por la consola.

Existen tros aspectos o funcionalidades que también deberán de estar presentes, será imprescindible el uso de mensajes informativos que se mostrarán con color verde, mientras que los mensajes de error se mostrarán con color rojo.

En esta ocasión, el servidor ocupará el papel de la API síncrona de Node.js y será responsable de hacer persistente la lista de notas de cada usuario:

* Guardar cada nota de la lista a un fichero con formato JSON. Los ficheros JSON correspondientes a las notas de un usuario concreto deberán almacenarse en un directorio con el nombre de dicho usuario.

* Cargar una nota desde los diferentes ficheros con formato JSON almacenados en el directorio del usuario correspondiente.

### --> Implementación

A partir de ahora, vamos a pasar a explicar la solución propuesta para esta práctica. Esta gira entorno a las notas, por tanto, vamos a comenzar viendo el fichero `note.ts`.

#### --> Fichero note.ts 

Contiene la clase `Note` con los siguietes atributos:

```typescript
/**
   * @param title, title of a note
   * @param color, color of a note
   * @param text, text or body of a note 
   */
```

También va a presentar los siguientes métodos:

```typescript
  getTitle() // returns the title of a note
  getColor() // returns the color of a note
  getText() // returns the text or body of a note
```

Además, cuenta con un enumerado denominado `Color` que contiene los distintos colores disponibles para las notas. Como podemos ver, esta clase tiene como misión dotar a una nota de sus características fundamentales.


### ------------------------------------------------------------------------------------------------------------------------------

Pasamos ahora a hablar sobre el contenido de `interfaces.ts`.

#### --> Fichero `interfaces.ts`

Tiene dos interfaces, la primera de ellas, `IndexEntry`, que nos va a permitir almacenar información sobre el título y el usuario de una determinada nota, para asignarlo como entrada a un **índice**, donde estarán alojados todos los títulos de las notas de cada usuario. La segunda es `NoteIndex` que tiene un `index` que va a ser de tipo `IndexEntry` para poder ver todas las notas de cada usuario.

```typescript
interface IndexEntry {} // interface IndexEntry, entries of the index
interface NoteIndex {} // interface NoteIndex, index with all the entries
```

Además, en esta práctica, se han añadido dos `types`: `RequestType` y `ResponseType` que tendrán los distintos argumentos que acompañarán tanto a las peticiones al servidor como a las respuestas del mismo.

```typescript
export type RequestType = {
  type: 'add' | 'update' | 'remove' | 'read' | 'list';
  user: string;
  title?: string;
  body?: string;
  color?: Color;
}

export type ResponseType = {
  type: 'add' | 'update' | 'remove' | 'read' | 'list' | 'error';
  success: boolean;
  notes?: Note[];
  errorMessage?: string;
}
```

### ------------------------------------------------------------------------------------------------------------------------------

#### --> Fichero utils.ts

El siguiente del que hablaremos será `utils.ts`, este contiene funciones de gran apoyo empleadas a lo largo largo del código y que nos van a permitir cumplir con nuestro objetivo.

Las funciones de las que disponemos son:

```typescript
getNoteByTitle(title: string, notes: Note[]) // checks if a note exists looking for the title
searchEntryIndex(title: string, index: NoteIndex) // looks for an entry of the user index
getColorByString(color: string) // received a color int a string and returns the
                                // correspondent color defined into de enum Color
getColorizer(note: Note) // uses the API chalk to paint with differents color
```

Los métodos más interesantes son `getNoteByTitle` y `searchEntryIndex`.

* **getNoteByTitle**. Este método realiza una búsqueda donde toma el atributo `title` de una nota e itera dentro del vector donde se encuentras todas las notas hasta encontrar una coincidencia, si la hay, devuelve la nota encontrada, sino es que no hay ninguuna nota con ese título y devuelve false.

* **searchEntryIndex**. Es muy parecido al anterior, pero se encarga de buscar una entrada dentro de todas las que se encuentran en el índice. Si la encuentra, devolverá aquella entrada cuyo título haya dado coincidencia, en caso contrario, devolverá false.


### ------------------------------------------------------------------------------------------------------------------------------

#### --> Fichero fileIO.ts

A continuación es el turno del fichero `fileIO.ts`, aquí se encuentran las funciones correspondientes para poder cargar las notas, guardar las notas y eliminarlas. El manejo del sistema de ficheros también se encuentra en este fichero gracias a la funcionalidad adquirida al hacer `import * as fs from 'fs'`.

```typescript
loadIndex(dirPath: string) // load the index with the informations with all the notes of an user
loadNotes(user: string) // load all the notes of an user
saveNote(user: string, note: Note) // saves the title, body and color of the note in the 
                                   // correspondent directory of the user, if it does not 
                                   // exist, the method will create it.
removeNote(user: string, title: string) // delete searching by the title, the entry of a 
                                        // note located into the index of an user
```

La función `loadIndex` es una función de uso local en este fichero, y nos va a servir de apoyo en las otras puesto que nos permite actualizar el índice, ya sea cargando, guardando notas nuevas o eliminando alguna ya existente, funcionalidades correspondientes a los otros métodos.


* `loadNotes`. Permite cargar las notas. Su cometido en primera instancia, será obtener un `dirPath` que será el directorio de un usario, donde se van a almacenar todas sus notas, así como un índice denominado `index.json` con el título de cada una así como los ficheros .json creados por cada una de ellas. Una vez tenemos el dirPath, cargamos el índice correspondiente, donde iremos almacenando los ficheros **.json**. Para ello, usaremos un ``join` con el dirPath y el `fileName`, para más adelante parsearlo y conseguir el objeto JSON. El último paso será hacer un `push` con la información que se va a almacenar referida a la nota en ese fichero que se va a crear, y retornamos el vector de notas.


* `saveNote`. Como en el caso anterior, necesitaremos un dirPath y además, requeriremos de una variable llamada `index` que será como un vector de entradas del índice. Si  ese usuario no tenía notas, crea la carpeta e inicializamos el index, en caso contrario, tenemos que añadir esa nueva entrada a index.
Luego, crearemos un `indexEntry`, donde almacenaremos una variable tipo  `IndexEntry` si se realiza correctamente, o false en caso de que la operación no sea correcta. Si el título ya estaba, solo tenemos que igualarlo, sino tendremos que crear el fichero .json con el título y sustituyendo espacio en blanco (en caso de haberlos) por `_` y concatenar luego .json, luego hacemos un push y le damos la ruta correspondiente para que se cree dentro del directorio personal del usuario en cuestión. 
El último paso sería escribir la nota.


* `removeNote`. Esta función también requiere del dirPath, si comprueba que existe, carga el índice correspondiente y acto seguido vamos a recorrer cada una de las entradas que tenga, hasta dar con una con el mismo título que la que estamos buscando. Si la encuentra, la borraremos con un `fs.unlinkSync` seguido de un `splice(i, 1)` que nos va a borrar una entrada desde la posición actual.


### ------------------------------------------------------------------------------------------------------------------------------
#### --> Fichero requestEmitter.ts

En este fichero vamos a implementar la clase `requestEmitter`, que nos va a permitir que el cliente pueda comunicarse correctamente con el servidor, además de poder resolver la problemática de la recepción de mensajes a trozos.

```typescript
export class RequestEmitter extends EventEmitter {
  constructor(connection: EventEmitter) {
    super();

    let wholeRequest = '';
    connection.on('data', (dataChunk) => {
      wholeRequest += dataChunk;

      let messageLimit = wholeRequest.indexOf('\0');
      if (messageLimit !== -1) {
        wholeRequest = wholeRequest.substring(0, messageLimit);
        this.emit('request', JSON.parse(wholeRequest));
      }
    });
  }
}
```

Aquí vemos como desde `conenciton` vamos a poder acceder al manejador o callback que se ejecutará con cada emisión del evento data por parte del objeto ``EventEmitter`` que va a almacenar en nuestra petición `request` un mensaje completo recibido a trozos desde el servidor y este finalizará cuando encuentre el caracter "\0". Es por ello que el manejador siempre trata de encontrar dicho caracter en ``wholeData``. Una vez que se ha recibido un mensaje, un objeto ``RequestEmitter`` emitirá un evento de tipo ``request``, además de emitir también un objeto JSON.

### ------------------------------------------------------------------------------------------------------------------------------



### ------------------------------------------------------------------------------------------------------------------------------

#### --> Fichero index.ts

Finalmente llegamos al `index.ts`, aquí es donde usamos `yargs` para parsear diferentes argumentos pasados a un programa desde la línea de comandos. En concreto permite gestionar diferentes comandos, cada uno de ellos, con sus opciones y manejador correspondientes. 
A modo de ejemplo, vamos a ver su funcionamiento con uno de los comandos que se van a implementar, `add`:

```typescript
yargs.command({
  command: 'add',
  describe: 'Add a new note',
  builder: {
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
    user: {
      describe: 'Notes owner',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Note body',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Note color',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.title === 'string' && typeof argv.user === 'string' && 
          typeof argv.body === 'string' && typeof argv.color === 'string') {
      
      const color = getColorByString(argv.color);
      if(color) {
        const req: RequestType = {
          type: 'add',
          user: argv.user,
          title: argv.title,
          body: argv.body,
          color: color
        };
        const client = net.connect({port: 60300});
        client.write(JSON.stringify(req) + '\0');

        let wholeData = '';
        client.on('data', (dataChunk) => {
          wholeData += dataChunk;
        });
        
        client.on('end', () => {
          const resp: ResponseType = JSON.parse(wholeData);
          if(resp.success) {
            console.log(chalk.green('New note added!'));
          } else {
            console.log(chalk.red(resp.errorMessage));
          }
        });
      } else {
        console.log(chalk.red('Invalid color'));
        console.log(chalk.red('Admited colors: Red, Blue, Green, Yellow, Black'));
      }
    } else {
      console.log(chalk.red('It is necesary to give all the arguments'));
    }
  },
});
```

Este nos permite añadir una nota nueva, para ello necesitaremos que nos pasen 4 argumentos, el nombre del usuario, título de la nota, texto o body de la misma y finalmente su color, de lo contrario, saltará un error que nos va a indicar que nos faltan argumentos.

Lo primero sería comprobar si hay color tras convertirlo al enum, una vez hecho esto, se crearía una variable `req` de tipo `RequestType` con cada uno de los argumentos que nos han dado. Luego, se establecería una conexión desde el cliente gracias a `net.connect` y acto seguido serializamos este mensaje con el método ``JSON.stringify``.
Si todo va bien, se activará el evento `data` donde vamos a ir escribiendo la información correspondiente a la petición que el cliente solicitó. 
Posteriormente, tendremos el evento `end` y declararemos una variable de tipo `ResponseType` con la respuesta del servidor mediante el atributo `success`. Finalmente, nos aparecerá un mensaje en verde diciendo que la nota se ha añadido. Aquí un ejemplo:

```
[~/DSI/practica10(master)]$npx ts-node src/index.ts add --user="edusegre" --title="Special yellow note" --body="This is now a special yellow note" --color="yellow"
New note added!

[~/DSI/practica10(master)]$npx ts-node src/index.ts add --user="edusegre" --title="Special yellow note" --body="This is now a special yellow note" --color="yellow"
Error! Already exist a note with this title
```

#### --> Ejemplos de métodos de empleo de los comandos add, remove, modify, list y read.

```
  * npx ts-node src/index.ts add --user="edusegre" --title="Black note" --body="This is now a black note" --color="black"

  * npx ts-node src/index.ts read --user="edusegre" --title="Yellow note"

  * npx ts-node src/index.ts list --user="edusegre"

  * npx ts-node src/index.ts modify --user="edusegre" --title="Yellow  note" --body="This is now a yellow note" --color="yellow"

  * npx ts-node src/index.ts remove --user="edusegre" --title="Red note"
```

Finalmente, vamos a ver la salida de las pruebas diseñadas para probar el correcto funcionamiento del código:

```
> prueba@1.0.0 coverage
> nyc npm test


> prueba@1.0.0 test
> mocha



  fileIO functions tests
    ✓ it saves a note and loads it back
    ✓ it deletes a note and check that it is removed

  note functions tests
    ✓ Checks the title of a note
    ✓ Checks the color of a note
    ✓ Checks the text of a note

  utils functions tests
    ✓ it search the title of a vector with some notes
    ✓ returns false because the title which is looking for does not exist
    ✓ it search an entry for a user index
    ✓ it search a false entry for a user index
    ✓ Checks if the color of the note is red
    ✓ Checks if the color of the note is blue
    ✓ Checks if the color of the note is yellow
    ✓ Checks if the color of the note is green
    ✓ Checks if the color of the note is black
    ✓ returns false because the color gray is not available


  15 passing (82ms)
```

Vamos a ver algunas de ellas con más detenimiento:

* Comprobamos el título de una nota:
```
describe("note functions tests", () => {
  it("Checks the title of a note", () => {
    const note1 = new Note("note1", Color.YELLOW, "yellow test");
    expect(note1.getTitle()).to.be.equal('note1');
  });
)};
```

* Comprobamos que reacciona correctamente si el título buscado no coincide con ninguna de las notas que tiene almacenadas en el índice:
```
describe("utils functions tests", () => {
  it("it search a false entry for a user index", () => {
    const indexTest: NoteIndex = {
      "index": [{ "title": "Yellow note", "fileName": "Yellow_note.json" },
      { "title": "Red note", "fileName": "Red_note.json" }, { "title": "Blue note", "fileName": "Blue_note.json" },
      { "title": "Green note", "fileName": "Green_note.json" }, { "title": "Black note", "fileName": "Black_note.json" }]
    };
    const entry: IndexEntry = { "title": "Orange note", "fileName": "Blue_note.json" };
    expect(searchEntryIndex(entry.title, indexTest)).to.be.false;
  });
)};
```

* Eliminamos una nota y comprobamos que se borra satisfactoriamente:

```
describe("fileIO functions tests", () => {
  it("it deletes a note and check that it is removed", () => {
    const note1 = new Note("note1", Color.YELLOW, "yellow test");
    const testUser = "testing";
    saveNote(testUser, note1);
    removeNote(testUser, note1.getTitle());
    expect(loadNotes(testUser)).not.contains(note1);
  });
});
```

### --> Referencias

Para la realización de esta práctica me he servido tanto de los ejemplos que se muestran en el enunciado de la práctica, como de los apuntes sobre Node.js también en el aula, además de material externo consultado en la web.

* [Enunciado de la práctica](https://ull-esit-inf-dsi-2021.github.io/prct08-filesystem-notes-app/)
* [GitHub Page de Yargs](https://github.com/yargs/yargshttps://github.com/yargs/yargs)
* [GitHub Page de Chalk](https://github.com/chalk/chalk)
* [Apuntes Node.js](https://ull-esit-inf-dsi-2021.github.io/nodejs-theory/)
Para consultar más información sobre el funcionamiento de Node.js se encontraba disponible en el aula el libro `Node.js 8 the Right Way`.

