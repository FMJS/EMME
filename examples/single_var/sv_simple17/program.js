if (this.Worker) {
(function execution() {
var t1 =
`onmessage = function(data) {
var x = new Int8Array(data.x_sab); x[0] = 1;
for(i = 0; i <= 2; i++){
var x = new Int8Array(data.x_sab); x[i+1] = i+1;
}
};`;
var t2 =
`onmessage = function(data) {
for(i = 0; i <= 1; i++){
var x = new Int16Array(data.x_sab); id4_R_t2 = x[i]; print("id4_R_t2_"+i+": "+id4_R_t2);
}
};`;
var data = {
x_sab : new SharedArrayBuffer(8),
}
 
var wt1 = new Worker(t1);
var wt2 = new Worker(t2);
wt1.postMessage(data, [data.x_sab]);
wt2.postMessage(data, [data.x_sab]);
})();
}
