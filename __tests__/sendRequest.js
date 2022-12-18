const path = require ('path')
const UUID = require ('uuid')
const {SmevSoap}  = require ('../')
const {getBody}   = require ('./lib/soap')
const {orUndefined} = require ('./lib/o')
const {XMLSchemata} = require ('xml-toolkit')

const NS_SMEV = "urn://x-artefacts-smev-gov-ru/services/message-exchange/types/1.1"
const NS_SMEV_BASIC = "urn://x-artefacts-smev-gov-ru/services/message-exchange/types/basic/1.1"

const xsPath = path.join (__dirname, 'xsd', 'dom-gosuslugi-ru-smev3-debt-responses.xsd')
const XS = new XMLSchemata (xsPath)

const genData = () => ({
  ExportDebtRequestsRequest: {	
    "information-system-id": UUID.v4 (),
    "organization-id": UUID.v4 (),
    "request-id": [
      UUID.v4 (),
      UUID.v4 (),
    ],
  }
})

const toBe = (MessageID, data, ox = {}) => {

	if (!('Id' in ox)) ox.Id = 'U' + MessageID

	return {
        "localName": "SendRequestRequest",
        "namespaceURI": NS_SMEV,
        "attributes": {},
        "children": [
          {
            "localName": "SenderProvidedRequestData",
            "namespaceURI": NS_SMEV,
            "attributes": {
              "Id": ox.Id
            },
            "children": [
              {
                "localName": "MessageID",
                "namespaceURI": NS_SMEV,
                "attributes": {},
                "children": [MessageID]
              },
              {
                "localName": "MessagePrimaryContent",
                "namespaceURI": NS_SMEV_BASIC,
                "attributes": {},
                "children": [
                  {
                    "localName": "ExportDebtRequestsRequest",
                    "namespaceURI": "urn:dom.gosuslugi.ru/debt-responses/1.0.0",
                    "attributes": {},
                    "children": [
                      {
                        "localName": "information-system-id",
                        "namespaceURI": "urn:dom.gosuslugi.ru/common/1.2.0",
                        "attributes": {},
                        "children": [
                          data.ExportDebtRequestsRequest ["information-system-id"]
                        ]
                      },
                      {
                        "localName": "organization-id",
                        "namespaceURI": "urn:dom.gosuslugi.ru/common/1.2.0",
                        "attributes": {},
                        "children": [
                          data.ExportDebtRequestsRequest ["organization-id"]
                        ]
                      },
                      
                      ...(data.ExportDebtRequestsRequest ["request-id"].map (id => ({
                        "localName": "request-id",
                        "namespaceURI": "urn:dom.gosuslugi.ru/debt-responses/1.0.0",
                        "attributes": {},
                        "children": [id]
                      })))
                    ]
                  }
                ]
              }
              ,...(ox.test ? [
				 {
				   "localName": "TestMessage",
				   "namespaceURI": NS_SMEV,
				   "attributes": {},
				   "children": [],
				 },              
              ] : [])
            ]
          }
        ]
      }

}

function t (os, MessageID, data, xs, ox) {

	const make = () => new SmevSoap (os).sendRequest (MessageID, data, xs, ox)

	test (JSON.stringify ([os, ox]), () => {
	
		if (
			MessageID == null
			|| (data == null || typeof data !== 'object')
			|| (xs == null)
		) {

			expect (make).toThrow ()

		}
		else {

			const xml = make () 

			const domAsIs = getBody (xml, os)

			const domToBe = toBe (MessageID, data, ox)

			expect (domAsIs).toStrictEqual (domToBe)

		}
	
	})
	
}


for (const test of [
		undefined, 
		true,
		false,
	]) {

for (const Id of [
		undefined, 
		'1'
	]) {

	for (const MessageID of [
		undefined,
		UUID.v4 (),
	]) {
	
		for (const header of [
			undefined,
			'',
			'1'
		]) {
		
			for (const declaration of [
				undefined,
				null,
			]) {

				for (const os of orUndefined ({header, declaration})) {

					for (const ox of orUndefined ({Id, test})) {
						
						for (const data of [
							null,
							0,
							genData ()
						]) {

							for (const xs of [
								null,
								xsPath,
								XS
							]) {

								t (os, MessageID, data, xs, ox)
							
							}

						}
						
					}
						
				}

			}
		
		}
		
	}

}
}