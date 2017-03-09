// Thread t1
$.agent.start(
`
$.agent.receiveBroadcast(function (data) {
var report = [];
var x = new Int8Array(data.x_sab); x[0] = 1;
var x = new Int8Array(data.x_sab); x[0] = 2;
$.agent.report(report);
$.agent.leaving();
})
`);
// Thread t2
$.agent.start(
`
$.agent.receiveBroadcast(function (data) {
var report = [];
var x = new Int8Array(data.x_sab); id4_R_t2 = x[0]; report.push("id4_R_t2: "+id4_R_t2);
var x = new Int8Array(data.x_sab); id5_R_t2 = x[0]; report.push("id5_R_t2: "+id5_R_t2);
if(id4_R_t2 == id5_R_t2) {
var x = new Int8Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
} else {
var x = new Int8Array(data.x_sab); id7_R_t2 = x[0]; report.push("id7_R_t2: "+id7_R_t2);
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
ex[0] = "id4_R_t2: 2;id5_R_t2: 2;id6_R_t2: 2"
ex[1] = "id4_R_t2: 0;id5_R_t2: 1;id7_R_t2: 2"
ex[2] = "id4_R_t2: 0;id5_R_t2: 2;id7_R_t2: 2"
ex[3] = "id4_R_t2: 0;id5_R_t2: 1;id7_R_t2: 1"
ex[4] = "id4_R_t2: 1;id5_R_t2: 2;id7_R_t2: 2"
ex[5] = "id4_R_t2: 1;id5_R_t2: 1;id6_R_t2: 2"
ex[6] = "id4_R_t2: 1;id5_R_t2: 1;id6_R_t2: 1"
ex[7] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 2"
ex[8] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 1"
ex[9] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 0"
var ok = false;
for(var i=0; i < ex.length; i++){
if (res == ex[i]) {
ok = true;
}
}
assert(ok);
