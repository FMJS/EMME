// Thread t1
$.agent.start(
`
$.agent.receiveBroadcast(function (data) {
var report = [];
var x = new Float64Array(data.x_sab); id2_R_t1 = x[0]; report.push("id2_R_t1: "+id2_R_t1.toFixed(2));
var x = new Float32Array(data.x_sab); x[0] = 1.00;
var x = new Float32Array(data.x_sab); x[1] = 1.00;
$.agent.report(report);
$.agent.leaving();
})
`);
// Thread t2
$.agent.start(
`
$.agent.receiveBroadcast(function (data) {
var report = [];
var x = new Float64Array(data.x_sab); id5_R_t2 = x[0]; report.push("id5_R_t2: "+id5_R_t2.toFixed(2));
var x = new Float32Array(data.x_sab); x[0] = 2.00;
var x = new Float32Array(data.x_sab); x[1] = 2.00;
$.agent.report(report);
$.agent.leaving();
})
`);
var data = {
x_sab : new SharedArrayBuffer(8),
}

$.agent.broadcast(data);
var res = [];
var report;
var reports = 0;
while (true) {
report = $.agent.getReport();
if (report != null) {
for(var i=0; i < report.length; i++){
res.push(report[i]);
print(report[i]);
}
reports += 1;
if (reports >= 2) break;
}
}
res.sort();
res = res.join(";");
var ex = [];
ex[0] = "id2_R_t1: 0.00;id5_R_t2: 0.00"
ex[1] = "id2_R_t1: 0.00;id5_R_t2: 0.01"
ex[2] = "id2_R_t1: 2.00;id5_R_t2: 0.00"
var ok = false;
for(var i=0; i < ex.length; i++){
if (res == ex[i]) {
ok = true;
}
}
assert(ok);
