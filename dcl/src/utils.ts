
export function getRandomHexColor(): string {
	const letters = "0123456789ABCDEF";
	let color = "#";
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

export function notNull(obj: any): boolean {
	return obj !== null && obj !== undefined;
  }
export function isNull(obj: any): boolean {
	return obj === null || obj === undefined;
}
  

export function wordWrap(str:string, maxWidth:number, maxLines:number) {
	let newLineStr = "\n"
	let done = false 
	let res = ''
	let linesSeparate = str.split(newLineStr)
	let lines = ''
  
	//log("original lines: " + str.split(newLineStr).length)
	
	if(str.length > maxWidth){
	  for( let j=0; j< linesSeparate.length; j++){
		res = ''
		done = false 
		//process each line for linebreaks
		while (linesSeparate[j].length > maxWidth) {  
		 
		  let found = false;
		  // Inserts new line at first whitespace of the line
		  for (let i = maxWidth - 1; i >= 0; i--) {
			  if (testWhite(linesSeparate[j].charAt(i))) {
				  res = res + [linesSeparate[j].slice(0, i), newLineStr].join('');
  
				  //don't remove slash, but break line
				  if(testSlash(linesSeparate[j].charAt(i))){
					linesSeparate[j] = linesSeparate[j].slice(i);
				  }
				  // remove white space completely
				  else{
					linesSeparate[j] = linesSeparate[j].slice(i + 1);
				  }
				  
				  found = true;            
				  break;
			  }
		  }
		  // Inserts new line at maxWidth position, the word is too long to wrap
		  if (!found) {
			  res += [linesSeparate[j].slice(0, maxWidth), newLineStr].join('');
			  linesSeparate[j] = linesSeparate[j].slice(maxWidth);        
		  }
		} 
	  
		lines +=  res + linesSeparate[j] + "\n"
	  
	  }
		  
		
		//let lines = res + str
		let finalLines = lines.split('\n') 
		let croppedResult = ''
	  
		for(let i=0; i < maxLines && i < finalLines.length; i++){
		  if(i == maxLines - 1 ){
			croppedResult += finalLines[i] 
		  }
		  else{
			croppedResult += finalLines[i] + '\n'  
		  }
		}
	  
		// if(finalLines.length > maxLines){
		//   croppedResult += '...'
		// }
		return croppedResult;
	}
	else {
	  return str
	}
  
	
  }
  
  function testWhite(x:string):boolean {
	var white = new RegExp(/^[\s/]+$/);
	return white.test(x.charAt(0));
  }
  
  function testSlash(x:string):boolean{
	var white = new RegExp(/^[/]+$/);
	return white.test(x.charAt(0));
  }
  
  export function shortenText(text: string, maxLenght: number) {
	let finalText: string = ''
  
	if (text.length > maxLenght) {
	  finalText = text.substring(0, maxLenght)
	  finalText = finalText.concat('...')
	} else {
	  finalText = text
	}
  
	return finalText
  }

/**
 * FIXME make synchronize https://spin.atomicobject.com/2018/09/10/javascript-concurrency/
 * https://www.npmjs.com/package/mutexify
 * 
 * @param name - name of the wrapped promise - for debugging
 * @param proc - promise to be synchronized, prevent concurrent execution 
 * @returns 
 */
 export const preventConcurrentExecution = <T>(name:string,proc: () => PromiseLike<T>) => {
    let inFlight: Promise<T> | false = false;
  
    return () => {
      if (!inFlight) {
        inFlight = (async () => {
          try {
            //  log("preventConcurrentExecution",name," start flight")
            return await proc();
          } finally {
            //log("preventConcurrentExecution",name,"  not in flight")
            inFlight = false;
          }
        })();
      }else{
        //log("preventConcurrentExecution",name," not in flight return same as before")
      }
      return inFlight;
    };
  };

  export function formatTime(timeSeconds: number,fractionDigits:number=1): string {
    if(timeSeconds<=0){
      return "00:00.0"
    /*}else if(timeSeconds<60){
      if(timeSeconds<10){
        return "00:0"+timeSeconds.toFixed(1)
      }else{
        return "00:"+timeSeconds.toFixed(1)
      }*/
    }else{
      //debugger
      //timeSeconds+=50
      let minutes = Math.floor((timeSeconds % ( 60 * 60)) / ( 60));
      let seconds = (timeSeconds % ( 60)) ;
    
      return (minutes < 10 ? "0" + minutes : minutes) + ":"+(seconds < 10 ? "0" + seconds.toFixed(1) : seconds.toFixed(fractionDigits))// + "-"+timeSeconds.toFixed(1)
    
    }
  }