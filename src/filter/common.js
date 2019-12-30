//序列化请求参数
export const formatParams=(data) =>{
    var arr = [];
    for (var name in data) {
    arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
    }
    return arr.join("&");
}
export const moneyFilters = (num) => {
  if(String(num).includes('.')){
      if(String(num).split('.')[1].length==1){
            num=Number(num).toFixed(2)  
            return num && num.toString().replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {return $1 + ","; });
      }else{
            return num && num.toString().replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {return $1 + ","; });
      }
  }else{
  	      if(num==0){
  	      	        return num
  	      }else if(num==undefined||num==null){
                   return ''       
  	      }else{
  	      	   num=Number(num).toFixed(2)  
               return num && num.toString().replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {return $1 + ","; });  
  	      } 
           
  }
}