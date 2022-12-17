const path = require ('path')
const {SOAP, XMLSchemata} = require ('xml-toolkit')

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
	
	ack (id, options = {}) {
	
		if (id == null) throw new Error ('Message Id not set')
		
		if (!('Id'       in options)) options.Id       = 'U' + id
		if (!('accepted' in options)) options.accepted = true

		const {Id, accepted} = options

		return this.toSoap ({AckRequest: {

			AckTargetMessage: {Id, accepted, null: id}

		}})
	
	}

}

module.exports = SmevSoap