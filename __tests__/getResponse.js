const {SmevSoap}  = require ('../')
const {XMLParser} = require ('xml-toolkit')

const p = new XMLParser (), parse = xml => p.process (xml).detach ()

const NS_SOAP = "http://schemas.xmlsoap.org/soap/envelope/"
const NS_SMEV = "urn://x-artefacts-smev-gov-ru/services/message-exchange/types/1.1"
const NS_SMEV_BASIC = "urn://x-artefacts-smev-gov-ru/services/message-exchange/types/basic/1.1"
const XML_DECL = '<?xml version="1.0" encoding="UTF-8"?>'

function t (os, ox) {

	const label = JSON.stringify ([os, ox])

	const s = new SmevSoap (os)
	
	const xml = s.getResponse (ox), asis = parse (xml)

	if (!os) os = {}

	if (!ox) ox = {}
	if (!('Id' in ox)) ox.Id = 'U9552f341-4b2b-4cb3-b0b5-fea58fa165e1'
	if (!('Timestamp' in ox)) ox.Timestamp = new Date ()

	const ts = asis.children.find (i => i.localName === 'Body').children [0].children [0].children [0].children

	test ('ts ' + label, () => {expect (new Date () - new Date (ts [0])).toBeLessThan (1000)})
	
	ts [0] = ox.Timestamp.toJSON ()

	const tobe = {
	  "localName": "Envelope",
	  "namespaceURI": "http://schemas.xmlsoap.org/soap/envelope/",
	  "attributes": {},
	  "children": [
		{
		  "localName": "Body",
		  "namespaceURI": "http://schemas.xmlsoap.org/soap/envelope/",
		  "attributes": {},
		  "children": [
			{
			  "localName": "GetResponseRequest",
			  "namespaceURI": "urn://x-artefacts-smev-gov-ru/services/message-exchange/types/1.1",
			  "attributes": {},
			  "children": [
				{
				  "localName": "MessageTypeSelector",
				  "namespaceURI": "urn://x-artefacts-smev-gov-ru/services/message-exchange/types/basic/1.1",
				  "attributes": {
					"Id": ox.Id
				  },
				  "children": [
					{
					  "localName": "Timestamp",
					  "namespaceURI": "urn://x-artefacts-smev-gov-ru/services/message-exchange/types/basic/1.1",
					  "attributes": {},
					  "children": [
						ox.Timestamp.toJSON ()
					  ]
					}
				  ]
				}
			  ]
			}
		  ]
		}
	  ]
	}

	if ('header' in os) tobe.children.unshift ({
		"localName": "Header",
		"namespaceURI": NS_SOAP,
		"attributes": {},
		"children": [os.header].filter (s => s !== '')
	})

	test ('dom ' + label, () => {expect (asis).toStrictEqual (tobe)})
	
	if ('declaration' in os && os.declaration === null) {

		test ('decl ' + label, () => {expect (xml).toMatch (/^<\w+:Envelope\s/)})

	}
	else {

		test ('decl ' + label, () => {expect (xml.indexOf (XML_DECL)).toBe (0)})

	}

}

for (const Id of [
		undefined, 
		'1'
	]) {

	for (const Timestamp of [
		undefined,
		new Date (),
	]) {
	
		for (const header of [
			undefined,
			'',
			'1'
		]) {
		
			let os = {header, declaration: null}
			for (const k in os) if (os [k] === undefined) delete os [k]
			let oss = [os]; if (Object.keys (os).length === 0) oss.push (undefined)

			let ox = {Id, Timestamp}
			for (const k in ox) if (ox [k] === undefined) delete ox [k]
			let oxs = [ox]; if (Object.keys (ox).length === 0) oxs.push (undefined)

			for (const _os of oss) 
				for (const _ox of oxs) 
					t (_os, _ox)
		
		}
		
	}

}

