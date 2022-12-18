const {SmevSoap} = require ('../')
const {orUndefined} = require ('./lib/o')

function t (o) {

	const make = () => new SmevSoap (o)
	
	test ('constructor ' + JSON.stringify (o), () => {
	
		if (o && (
			('soap' in o && o.soap != '1.1' && o.soap != '1.2') ||
			('smev' in o && o.smev != '1.1')
		)) {
			expect (make).toThrow ()
		}
		else {
			expect (make ()).toBeInstanceOf (SmevSoap)
		}
	
	})

}

for (const soap of [undefined, 1.1, 1.2, 1.3]) {

	for (const smev of [undefined, 1.1, 1.2, 1.3]) {
	
		for (const o of orUndefined ({soap, smev})) {
		
			t (o)
		
		}

	}

}