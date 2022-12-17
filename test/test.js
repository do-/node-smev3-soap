const path = require ('path')
const {SmevSoap} = require ('../')

const s = new SmevSoap ({
//	declaration: null,
//	header: ''
})

console.log (s.ack ('9552f341-4b2b-4cb3-b0b5-fea58fa165e1', {
	Id: 1,
	accepted: false,
}))

console.log (s.getResponse ())

const id = '59a8e1bd-7cdd-11ed-a125-005056a5851b'
const data = {
	ExportDebtRequestsRequest: {	
		"information-system-id": "b94248ec-d124-4314-a751-8b4774e07a23",
        "organization-id": "33b5b356-0f18-433a-9b94-c27e9eab20c8",
		"request-id": [
			"00340f85-770f-11ed-a004-fb0ae3eac2d0",
			"02fa3465-770f-11ed-8349-a9c992e8328b",
		],
	}
}

const xs = path.join (__dirname, 'xsd', 'dom-gosuslugi-ru-smev3-debt-responses.xsd')

console.log (s.sendRequest (id, data, xs))
