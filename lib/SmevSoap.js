const path = require ('path')
const {SOAP, XMLSchemata, XMLIterator} = require ('xml-toolkit')

const DEFAULT_SOAP_VERSION    = '1.1'
const SUPPORTED_SMEV_VERSIONS = ['1.1']

const DEFAULT_ENCODING    = 'UTF-8'
const DEFAULT_DECLARATION = {encoding: DEFAULT_ENCODING}

const SmevSoap = class {

	constructor (options = {}) {

		this.soap = SOAP ('soap' in options ? options.soap : DEFAULT_SOAP_VERSION)

		{
		
			const ver = String (options.smev || SUPPORTED_SMEV_VERSIONS [0])

			if (!SUPPORTED_SMEV_VERSIONS.includes (ver)) throw new Error ('Unsupported SMEV version: ' + ver)

			const fn = path.join (__dirname, '..', 'xsd', 'smev', ver, `smev-message-exchange-service-${ver}.xsd`)
		
			this.xs = new XMLSchemata (fn)

		}

		this.declaration = 'declaration' in options ? options.declaration : DEFAULT_DECLARATION

		this.header = options.header

	}
	
	toSoap (data) {
	
		const {xs, header, declaration} = this
	
		const body = xs.stringify (data)

		return this.soap.message (body, header, {declaration})

	}
	
	ack (MessageID, options = {}) {
	
		if (MessageID == null) throw new Error ('MessageID not set')

		if (!('Id'       in options)) options.Id       = 'U' + MessageID
		if (!('accepted' in options)) options.accepted = true
		const {Id, accepted} = options

		return this.toSoap ({AckRequest: {

			AckTargetMessage: {Id, accepted, null: MessageID}

		}})
	
	}

	getResponse (options = {}) {

		if (!('Id'        in options)) options.Id        = 'U9552f341-4b2b-4cb3-b0b5-fea58fa165e1'
		if (!('Timestamp' in options)) options.Timestamp = new Date ()

		const {Id, Timestamp} = options

		return this.toSoap ({GetResponseRequest: {

			MessageTypeSelector: {Id, Timestamp}

		}})

	}
	
	sendRequest (MessageID, data, xs, options = {}) {
	
		if (MessageID    == null)     throw new Error ('MessageID not set')
		if (data         == null)     throw new Error ('Request data not set')
		if (xs           == null)     throw new Error ('XML Schema (or its location) not set')
		if (typeof data !== 'object') throw new Error ('Request data must be an Object instance')

		if (!(xs instanceof XMLSchemata)) xs = new XMLSchemata (xs)

		if (!('Id' in options)) options.Id = 'U' + MessageID
		
		const {Id} = options

		let SenderProvidedRequestData = {
			Id, 
			MessageID,
			MessagePrimaryContent: XMLSchemata.any (xs.stringify (data)),
		}
		
		if (options.test) SenderProvidedRequestData.TestMessage = {}
		
		return this.toSoap ({SendRequestRequest: {SenderProvidedRequestData}})

	}
	
	getMessageId (xml) {

		let f = false; for (const node of new XMLIterator (xml)) {

			if (node.isStartElement) {

				f ||= node.localName === 'MessageID'

				continue

			}

			if (f) return node.src

		}

	}

}

module.exports = SmevSoap