![workflow](https://github.com/do-/node-smev3-soap/actions/workflows/main.yml/badge.svg)
![Jest coverage](./badges/coverage-jest%20coverage.svg)

# node-smev3-soap

# Disclaimer

This software is developed solely for integration with Russian government IT systems, so the Cyrillic script is widely used in its documentation.

# Описание

`node-smev3-soap` -- библиотека node.js для формирования SOAP-запросов к Системе межведомственного электронного взаимодействия 3-й версии [(СМЭВ 3)](https://info.gosuslugi.ru/docs/section/%D0%A1%D0%9C%D0%AD%D0%92_3/).

Здесь рассматривается только задача составления текста сообщений в соответствии с утверждёнными [схемами](https://info.gosuslugi.ru/articles/%D0%9E%D0%BF%D0%B8%D1%81%D1%8B%D0%B2%D0%B0%D0%B5%D0%BC_%D1%82%D0%B8%D0%BF%D1%8B_%D0%B7%D0%B0%D0%BF%D1%80%D0%BE%D1%81%D0%BD%D0%BE%D0%B9_%D0%B8_%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D0%BD%D1%8B%D1%85_%D1%87%D0%B0%D1%81%D1%82%D0%B5%D0%B9_%D0%BE%D1%81%D0%BD%D0%BE%D0%B2%D0%BD%D0%BE%D0%B9_xsd-%D1%81%D1%85%D0%B5%D0%BC%D1%8B/) XML из данных, представленных обычными объектами javaScript.

## Ограничения

Отправка сообщений по сети, отслеживание очередей, обработка содержательной части ответов и т. п. задачи должны решаться приложениями, использующими `node-smev3-soap`, а не ей самой.

Подписывание сообщений также не относится к задачам, решаемым данной библиотекой. Она генерирует XML-документы, некоторое из элементов которых помечены атрибутами `Id`. Предполагается, что электронная подпись прикрепляется вызовом отдельного сервиса перед отправкой сообщения в СМЭВ.

# Установка
```
npm install smev3-soap
```

# Использование 
```js
const {SmevSoap} = require ('smev3-soap')
const smevSoap = new SmevSoap ()

const OriginalMessageID = '59a8e1bd-7cdd-11ed-a125-005056a5851b'
const data = {
  ExportDebtRequestsRequest: {	
    "information-system-id": "1c33b13d-992f-4eb5-b891-7bf845fda440",
    "organization-id": "360617e3-6813-4481-9c45-43a574f6b1af",
    "request-id": [
      "eb629532-8995-483f-b9fc-018ee5e5d8cd",
      "fd34f457-c8a8-4b95-8a72-1b6ce00cb6c1",
    ],
  }
}

const sendRequestXML = smevSoap.sendRequest (OriginalMessageID, data, 'dom-gosuslugi-ru-smev3-debt-responses.xsd')
const getResponseXML = smevSoap.getResponse ()

const MessageId      = smevSoap.getMessageId (responseResponseXML)
const ackXML         = smevSoap.ack (MessageId)
```
# Конструктор
```js
const smevSoap = new SmevSoap (/*{
//  soap: '1.1',
//  smev: '1.1',
//  declaration: {encoding: 'UTF-8'},
//  header: '',
}*/)
```
Создаёт экземпляр объекта, пригодный для генерации множества SOAP-сообщений с аналогичным набором опций.
## Опции
| Имя  | По умолчанию | Описание | Примечание |
| ---- | ------------ | -------- | ---------- |
| `soap`  | `'1.1'`  | Версия SOAP | Допустимо '1.1' или '1.2' |
| `smev`  | `'1.1'`  | Версия СМЭВ | Пока допустимо только '1.1' |
| `declaration`  | `{encoding: 'UTF-8'}` | Содержимое декларации XML | Можно подавить вывод декларации, указав `null`, или же установить собствееный `encoding`. В последнем случае, скорее всего, потребуется дополнительное перекодирование результата, поскольку XML генерируется всегда как String|
| `header` | `undefined`  | Содержимое SOAP-элемента Header | По умолчанию (`undefined`) `Header` отсутствует. Иначе он генерируется, причём значение опции `header` подставляется внутрь как есть (без замены скобок, кавычек и т. п.). В частности, если требуется пустой `Header`, можно указать здесь строку нулевой длины (`''`)|

# Методы
## `sendRequest `
Генерирует SOAP-конверт, содержащий элемент СМЭВ `SendRequestRequest` с содержимым (`SenderProvidedRequestData`), которое получено из заданного объекта данных по требуемой "схеме вида сведений".

```js
const OriginalMessageID = '59a8e1bd-7cdd-11ed-a125-005056a5851b'
const data = {
  ExportDebtRequestsRequest: {	
    "information-system-id": "1c33b13d-992f-4eb5-b891-7bf845fda440",
    "organization-id": "360617e3-6813-4481-9c45-43a574f6b1af",
    "request-id": [
      "eb629532-8995-483f-b9fc-018ee5e5d8cd",
      "fd34f457-c8a8-4b95-8a72-1b6ce00cb6c1",
    ],
  }
}

const sendRequestXML = smevSoap.sendRequest (OriginalMessageID, data, 'dom-gosuslugi-ru-smev3-debt-responses.xsd'/*, {
// Id: 1,
// test: true,
}*/)
```
### Параметры
| Имя  | Описание | Примечание |
| ---- | -------- | ---------- |
| `OriginalMessageID` | Идентификатор отправляемого сообщения | В результате подставляется в элемент `MessageID` |
| `data` | Объект данных для упаковки согласно схеме |  Подробнее о сериализации см. [`XMLMarshaller`](https://github.com/do-/node-xml-toolkit/wiki/XMLMarshaller) |
| `path` | Путь к корневому файлу XML-схемы | Или объект [`XMLSchemata`](https://github.com/do-/node-xml-toolkit/wiki/XMLSchemata), полученный из него |
| `options` | Набор опций | См. следующий раздел |

### Опции
| Имя  | По умолчанию | Описание | Примечание |
| ---- | ------------ | -------- | ---------- |
| `Id` | `'U' + OriginalMessageID` | Атрибут `Id` | Используется для обозначения подписываемого элемента. Значение самостоятельного смысла не имеет, так что необходимость в его использовании маловероятна |
| `test` | `false` | Добавлять ли `TestMessage` | При истинном значении этой опции `TestMessage` добавляется |

## `getResponse`
Генерирует SOAP-конверт, содержащий элемент СМЭВ `GetResponseRequest`.

```js
const getResponseXML = smevSoap.getResponse (/*, {
// Id: 1,
// Timestamp: new Date (),
}*/)
```
### Параметры
| Имя  | Описание | Примечание |
| ---- | -------- | ---------- |
| `options` | Набор опций | См. следующий раздел |

### Опции
| Имя  | По умолчанию | Описание | Примечание |
| ---- | ------------ | -------- | ---------- |
| `Id` | `'U9552f341-4b2b-4cb3-b0b5-fea58fa165e1'` | Атрибут `Id` |  |
| `Timestamp` | `new Date ()` | Метка времени в `MessageTypeSelector` | |

## `getMessageId`
Читает из данного XML содержимое первого встреченного элемента с локальным именем `MessageId`.
```js
const MessageId = smevSoap.getMessageId (responseResponseXML)
```

В отличие от остальных методов, этот не генерирует, а, наоборот, разбирает XML. Извлекаемое им значение далее нужно для составления запроса `Ack`.

`responseResponseXML` должен быть полученным от СМЭВ SOAP-сообщением, содержащим `GetResponseResponse`.

## `ack`
Генерирует SOAP-конверт, содержащий элемент СМЭВ `AckRequest` для заданного `MessageID`.

```js
const ackXML = smevSoap.ack (MessageID /*, {
// Id: 1,
// accepted: true,
}*/)
```
### Параметры
| Имя  | Описание | Примечание |
| ---- | -------- | ---------- |
| `MessageID` | Идентификатор сообщения | о получении которого требуется сообщить |
| `options` | Набор опций | См. следующий раздел |

### Опции
| Имя  | По умолчанию | Описание | Примечание |
| ---- | ------------ | -------- | ---------- |
| `Id` | `'U' + OriginalMessageID` | Атрибут `Id` | |
| `accepted` | `true` | Значение атрибута `accepted` | |
