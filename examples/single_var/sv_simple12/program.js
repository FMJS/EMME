// Thread t1
$.agent.start(
`
$.agent.receiveBroadcast(function (data) {
var report = [];
var x = new Float32Array(data.x_sab); x[0] = 1.10;
var x = new Float32Array(data.x_sab); x[1] = 1.10;
$.agent.report(report);
$.agent.leaving();
})
`);
// Thread t2
$.agent.start(
`
$.agent.receiveBroadcast(function (data) {
var report = [];
var x = new Float32Array(data.x_sab); x[1] = 2.20;
var x = new Float32Array(data.x_sab); x[2] = 2.20;
$.agent.report(report);
$.agent.leaving();
})
`);
// Thread t3
$.agent.start(
`
$.agent.receiveBroadcast(function (data) {
var report = [];
var x = new Float64Array(data.x_sab); id6_R_t3 = x[0]; report.push("id6_R_t3: "+id6_R_t3.toFixed(2));
var x = new Float32Array(data.x_sab); id7_R_t3 = x[0]; report.push("id7_R_t3: "+id7_R_t3.toFixed(2));
$.agent.report(report);
$.agent.leaving();
})
`);
var data = {
x_sab : new SharedArrayBuffer(16),
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
if (reports >= 3) break;
}
}
res.sort();
res = res.join(";");
var ex = [];
ex[0] = "id6_R_t3: 3.60;id7_R_t3: 0.00"
ex[1] = "id6_R_t3: 0.00;id7_R_t3: 0.00"
ex[2] = "id6_R_t3: 0.01;id7_R_t3: 1.10"
ex[3] = "id6_R_t3: 0.00;id7_R_t3: 1.10"
ex[4] = "id6_R_t3: 3.60;id7_R_t3: 1.10"
ex[5] = "id6_R_t3: 921.60;id7_R_t3: 1.10"
var ok = false;
for(var i=0; i < ex.length; i++){
if (res == ex[i]) {
ok = true;
}
}
assert(ok);
