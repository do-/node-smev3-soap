const {SmevSoap}  = require ('../')
const {getBody}   = require ('./lib/soap')
const {orUndefined} = require ('./lib/o')

const NS_SMEV = "urn://x-artefacts-smev-gov-ru/services/message-exchange/types/1.1"
const NS_SMEV_BASIC = "urn://x-artefacts-smev-gov-ru/services/message-exchange/types/basic/1.1"

const getTs = dom => dom.children [0].children [0].children

const toBe = (ox = {}) => {

	if (!('Id' in ox)) ox.Id = 'U9552f341-4b2b-4cb3-b0b5-fea58fa165e1'
	if (!('Timestamp' in ox)) ox.Timestamp = new Date ()

	return {
		"localName": "GetResponseRequest",
		"namespaceURI": NS_SMEV,
		"attributes": {},
		"children": [
			{
				"localName": "MessageTypeSelector",
				"namespaceURI": NS_SMEV_BASIC,
				"attributes": {
				"Id": ox.Id
			},
			"children": [
					{
						"localName": "Timestamp",
						"namespaceURI": NS_SMEV_BASIC,
						"attributes": {},
						"children": [
							ox.Timestamp.toJSON ()
						]
					}
				]
			}
		]
	}

}

function t (os, ox) {

	test (JSON.stringify ([os, ox]), () => {
	
		const xml = new SmevSoap (os).getResponse (ox)
		
		const domAsIs = getBody (xml, os)
		const domToBe = toBe (ox)
		
		{
			const tsAsIs = getTs (domAsIs)
			const tsToBe = getTs (domToBe)

			expect (new Date (tsToBe [0]) - new Date (tsAsIs [0])).toBeLessThan (1000)

			tsToBe [0] = tsAsIs [0]
		}

		expect (domAsIs).toStrictEqual (domToBe)

	})
	
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
		
			for (const declaration of [
				undefined,
				null,
			]) {

				for (const os of orUndefined ({header, declaration}))

					for (const ox of orUndefined ({Id, Timestamp}))

						t (os, ox)

			}
		
		}
		
	}

}

