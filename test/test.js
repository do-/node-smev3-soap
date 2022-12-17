const {SmevSoap} = require ('../')

const s = new SmevSoap ({
	declaration: null,
	header: ''
})

console.log (s.ack ('9552f341-4b2b-4cb3-b0b5-fea58fa165e1', {
	Id: 1,
	accepted: false,
}))