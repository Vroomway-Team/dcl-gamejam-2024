
export function getRandomHexColor(): string {
	const letters = "0123456789ABCDEF";
	let color = "#";
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
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


  export function notNull(obj: any): boolean {
    return obj !== null && obj !== undefined;
    }
  export function isNull(obj: any): boolean {
    return obj === null || obj === undefined;
  }