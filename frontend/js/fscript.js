console.log ("WHOAMI! ");
alert("JS Loaded") ;

let namee = ("Sarmen" ) ;
let surname = ("Apresyan " ) ; 
let age = 21; 
 age=20;
let subject = ("CS") ; 
console.log ("NAME :" , namee );
console.log ("aGE :" , age );
console.log ("SURNAME : " , surname ) ; 
console.log ("FAVSUBJ : ", subject) ;

let magicpower = true ;
let lor=null ;
console.log ("MAGIC : " , magicpower ) ;
console.log ("LLL : ", lor) ;
console.log ('hello ${namee} ur age is  ${age} ' ) ;
let museumlist= ["Louvre " , "MetropiliteaN" , "HERMITAGE" , "VAtican " ] 
for (let i = 0 ; i<museumlist.length  ; ++i ) {console.log(museumlist[i] ) ;}

let studnet = ["NIcklaus" , "DAMION" , "REbbeeca" , "CArlsie" ] ;
studnet.forEach(function(nameee) {
    console.log("NAME: ", nameee ) ;
})


let nums = [ 10 , 40 , 344, -3 , 0 , 20 ] ;
let MAX = nums[0];
for (let  n of nums ) { if ( n>MAX ) { MAX=n ; }   } 
console.log("MAX : ",  MAX )  ; 

function f( x, y) { return x*y  ; }
let res=f(9,10 ) ; let res2=f(23, 41) ; 
console.log("RES1 :" , res ) ;
console.log ("RES2 : " , res2 ) ;

let vampires = [ "Nico " , "Rebbe " , "Elljah " ] ; 
console.log ( "initialv vamps : "   , vampires) ;
vampires.push("GAreth "  ) ; 
vampires.unshift("Damon" ) ; 
vampires.pop();
vampires.shift(); 
console.log("First Vampire" , vampires[0] ) ;
console.log ("LAst vamire idx : " , vampires.length-1) ;
console.log("New vamp list : " , vampires) ;
localStorage.getItem(key)

// 07 , 12 ,2025 
/// fucntions practive]


let gbvar= 17 
function f1 ( ) {
    locvar =12 ; 
    console.log("msg " , locvar , gbvar ) ; }

    f1() ;