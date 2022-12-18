const {XMLParser} = require ('xml-toolkit')

const parse = xml => new XMLParser ().process (xml).detach ()

const XML_DECL = '<?xml version="1.0" encoding="UTF-8"?>'
const NS_SOAP = "http://schemas.xmlsoap.org/soap/envelope/"
const EMPTY_OBJECT = {}

const getChildren = (dom, localName) => {
	expect (dom.localName).toBe (localName)
	expect (dom.namespaceURI).toBe (NS_SOAP)
	expect (dom.attributes).toStrictEqual (EMPTY_OBJECT)
	return dom.children
}

const checkDeclaration = (xml, os) => {

	if ('declaration' in os && os.declaration === null) {

		expect (xml).toMatch (/^<\w+:Envelope\s/)

	}
	else {

		expect (xml.indexOf (XML_DECL)).toBe (0)

	}

}

module.exports = {
	
	getBody: (xml, os = {}) => {
	
		checkDeclaration (xml, os)
	
		const dom = parse (xml)
		
		const hb = getChildren (dom, 'Envelope')
		
		if ('header' in os) expect (getChildren (hb.shift (), 'Header')).toStrictEqual ([os.header].filter (s => s))
		
		expect (hb.length).toBe (1)
		
		const bc = getChildren (hb [0], 'Body')

		expect (bc.length).toBe (1)
		
		return bc [0]

	}

}