// Thread t1
$.agent.start(
`
$.agent.receiveBroadcast(function (data) {
var report = [];
var x = new Int8Array(data.x_sab); x[0] = 1;
for(i = 0; i <= 2; i++){
var x = new Int8Array(data.x_sab); x[i+1] = i+1;
}
$.agent.report(report);
$.agent.leaving();
})
`);
// Thread t2
$.agent.start(
`
$.agent.receiveBroadcast(function (data) {
var report = [];
for(i = 0; i <= 1; i++){
var x = new Int16Array(data.x_sab); id4_R_t2 = x[i]; report.push("id4_R_t2_"+i+": "+id4_R_t2);
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
ex[0] = "id4_R_t2_0: 1;id4_R_t2_1: 770"
ex[1] = "id4_R_t2_0: 0;id4_R_t2_1: 770"
ex[2] = "id4_R_t2_0: 1;id4_R_t2_1: 0"
ex[3] = "id4_R_t2_0: 0;id4_R_t2_1: 0"
ex[4] = "id4_R_t2_0: 1;id4_R_t2_1: 2"
ex[5] = "id4_R_t2_0: 0;id4_R_t2_1: 2"
ex[6] = "id4_R_t2_0: 257;id4_R_t2_1: 770"
ex[7] = "id4_R_t2_0: 257;id4_R_t2_1: 0"
ex[8] = "id4_R_t2_0: 257;id4_R_t2_1: 2"
var ok = false;
for(var i=0; i < ex.length; i++){
if (res == ex[i]) {
ok = true;
}
}
assert(ok);
