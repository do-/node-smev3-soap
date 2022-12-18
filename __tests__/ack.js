const {SmevSoap}    = require ('../')
const {getBody}     = require ('./lib/soap')
const {orUndefined} = require ('./lib/o')
const UUID = require ('uuid')

const toBe = (id, ox = {}) => {

	if (!('Id' in ox)) ox.Id = 'U' + id
	if (!('accepted' in ox)) ox.accepted = true

	const {Id, accepted} = ox
	
	return {
		"localName": "AckRequest",
		"namespaceURI": "urn://x-artefacts-smev-gov-ru/services/message-exchange/types/1.1",
		"attributes": {},
		"children": [
			{
				"localName": "AckTargetMessage",
				"namespaceURI": "urn://x-artefacts-smev-gov-ru/services/message-exchange/types/basic/1.1",
				"attributes": {
					"Id": ox.Id,
					"accepted": '' + !!ox.accepted
				},
				"children": [id]
			}
		]
	}	

}

function t (id, os, ox) {
	
	test (JSON.stringify ([id, os, ox]), () => {

		const xml = new SmevSoap (os).ack (id, ox)
		
		const domAsIs = getBody (xml, os)

		const domToBe = toBe (id, ox)

		expect (domAsIs).toStrictEqual (domToBe)

	})

}

for (const Id of [
		undefined, 
		'1'
	]) {

	for (const accepted of [
		undefined,
		true, 
		false, 
		0, 
		1, 
		'zzz',
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

					for (const ox of orUndefined ({Id, accepted}))

						t (UUID.v4 (), os, ox)

			}
		
		}
		
	}

}

