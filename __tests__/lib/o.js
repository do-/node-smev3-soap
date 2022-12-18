const EMPTY = [{}, undefined]

module.exports = {
	
	orUndefined: (o) => {
	
		let isEmpty = true

		for (const k in o) {
		
			if (o [k] === undefined) {
		
				delete o [k]
			
			}	
			else {
			
				isEmpty = false
			
			}
			
		}
		
		return isEmpty ? EMPTY : [o]
	
	}

}