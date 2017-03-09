// Thread t1
$.agent.start(
`
$.agent.receiveBroadcast(function (data) {
var report = [];
var x = new Int8Array(data.x_sab); x[0] = 1;
var x = new Int8Array(data.x_sab); x[1] = 1;
$.agent.report(report);
$.agent.leaving();
})
`);
// Thread t2
$.agent.start(
`
$.agent.receiveBroadcast(function (data) {
var report = [];
var x = new Int8Array(data.x_sab); x[1] = 2;
var x = new Int8Array(data.x_sab); x[2] = 2;
$.agent.report(report);
$.agent.leaving();
})
`);
// Thread t3
$.agent.start(
`
$.agent.receiveBroadcast(function (data) {
var report = [];
var x = new Int32Array(data.x_sab); id6_R_t3 = x[0]; report.push("id6_R_t3: "+id6_R_t3);
var x = new Int16Array(data.x_sab); id7_R_t3 = x[0]; report.push("id7_R_t3: "+id7_R_t3);
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
if (reports >= 3) break;
}
}
res.sort();
res = res.join(";");
var ex = [];
ex[0] = "id6_R_t3: 0;id7_R_t3: 1"
ex[1] = "id6_R_t3: 0;id7_R_t3: 0"
ex[2] = "id6_R_t3: 257;id7_R_t3: 513"
ex[3] = "id6_R_t3: 1;id7_R_t3: 1"
ex[4] = "id6_R_t3: 131585;id7_R_t3: 257"
ex[5] = "id6_R_t3: 131585;id7_R_t3: 513"
ex[6] = "id6_R_t3: 131329;id7_R_t3: 513"
ex[7] = "id6_R_t3: 0;id7_R_t3: 513"
ex[8] = "id6_R_t3: 0;id7_R_t3: 512"
ex[9] = "id6_R_t3: 257;id7_R_t3: 257"
ex[10] = "id6_R_t3: 512;id7_R_t3: 513"
ex[11] = "id6_R_t3: 512;id7_R_t3: 512"
ex[12] = "id6_R_t3: 1;id7_R_t3: 257"
ex[13] = "id6_R_t3: 513;id7_R_t3: 513"
ex[14] = "id6_R_t3: 1;id7_R_t3: 513"
ex[15] = "id6_R_t3: 131584;id7_R_t3: 512"
ex[16] = "id6_R_t3: 131584;id7_R_t3: 257"
ex[17] = "id6_R_t3: 131329;id7_R_t3: 257"
ex[18] = "id6_R_t3: 513;id7_R_t3: 257"
ex[19] = "id6_R_t3: 131584;id7_R_t3: 513"
ex[20] = "id6_R_t3: 0;id7_R_t3: 257"
ex[21] = "id6_R_t3: 512;id7_R_t3: 257"
var ok = false;
for(var i=0; i < ex.length; i++){
if (res == ex[i]) {
ok = true;
}
}
assert(ok);
