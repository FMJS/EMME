// Thread t1
$.agent.start(
`
$.agent.receiveBroadcast(function (data) {
var report = [];
var x = new Int8Array(data.x_sab); x[0] = 1;
var x = new Int8Array(data.x_sab); x[1] = 1;
var x = new Int8Array(data.x_sab); x[0] = 2;
var x = new Int8Array(data.x_sab); x[1] = 2;
$.agent.report(report);
$.agent.leaving();
})
`);
// Thread t2
$.agent.start(
`
$.agent.receiveBroadcast(function (data) {
var report = [];
var x = new Int8Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
if(id6_R_t2 < 1) {
var x = new Int8Array(data.x_sab); id7_R_t2 = x[0]; report.push("id7_R_t2: "+id7_R_t2);
} else {
var x = new Int8Array(data.x_sab); id8_R_t2 = x[1]; report.push("id8_R_t2: "+id8_R_t2);
}
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
ex[0] = "id6_R_t2: 0;id7_R_t2: 2"
ex[1] = "id6_R_t2: 0;id7_R_t2: 1"
ex[2] = "id6_R_t2: 0;id7_R_t2: 0"
ex[3] = "id6_R_t2: 1;id8_R_t2: 1"
ex[4] = "id6_R_t2: 2;id8_R_t2: 2"
ex[5] = "id6_R_t2: 1;id8_R_t2: 0"
ex[6] = "id6_R_t2: 1;id8_R_t2: 2"
ex[7] = "id6_R_t2: 2;id8_R_t2: 1"
var ok = false;
for(var i=0; i < ex.length; i++){
if (res == ex[i]) {
ok = true;
}
}
assert(ok);
