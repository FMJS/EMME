// Copyright 2017 Cristian Mattarei
//
// Licensed under the modified BSD (3-clause BSD) License.
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


// Thread t1
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); x[0] = 1;
      var x = new Int8Array(data.x_sab); x[1] = 1;
      var x = new Int8Array(data.x_sab); x[2] = 3;
      var x = new Int8Array(data.x_sab); x[3] = 3;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int16Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      var x = new Int16Array(data.x_sab); id7_R_t2 = x[1]; report.push("id7_R_t2: "+id7_R_t2);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

var data = {
   x_sab : new SharedArrayBuffer(8),
}
$262.agent.broadcast(data);
var report = [];

// MAIN Thread

var thread_report;
var reports = 0;
var i = 0;
while (true) {
   thread_report = $262.agent.getReport();
   if (thread_report != null) {
      for(i=0; i < thread_report.length; i++){
         report.push(thread_report[i]);
         print(thread_report[i]);
      }
      reports += 1;
      if (reports >= 2) break;
   }
}

report.sort();
report = report.join(";");
var outputs = [];
outputs[0] = "id6_R_t2: 0;id7_R_t2: 0";
outputs[1] = "id6_R_t2: 1;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 256;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 257;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 3";
outputs[5] = "id6_R_t2: 1;id7_R_t2: 3";
outputs[6] = "id6_R_t2: 256;id7_R_t2: 3";
outputs[7] = "id6_R_t2: 257;id7_R_t2: 3";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 768";
outputs[9] = "id6_R_t2: 1;id7_R_t2: 768";
outputs[10] = "id6_R_t2: 256;id7_R_t2: 768";
outputs[11] = "id6_R_t2: 257;id7_R_t2: 768";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 771";
outputs[13] = "id6_R_t2: 1;id7_R_t2: 771";
outputs[14] = "id6_R_t2: 256;id7_R_t2: 771";
outputs[15] = "id6_R_t2: 257;id7_R_t2: 771";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k1LwzAYB/C7nyJHhUGWpGlE8eCQ4UWFefBYhHooOOehO8m+u+3alax7ql2avhz+t/LkSV/S8qP8
//Ceebbfq9TTlnSRxGqyiVN2x+m8TmcMz5ehN/fGYNjwt2x34uk1hGb1EqZtkMtT+6mrGjakBWtVVVZK8i
//ewOyWtxrXi3utKiKrGP9nnzldWl123XVUA8a6rqhHjZct7yfHbt/fmBPL1iz9mtWe/qQrNq9iuxVZG9A
//9gZkryZ7db23eMerxXL/ko9W+PB02cx5PrtpUJSDhhqUfw2qw+WX5SdGnp+eXcx8fctn7i44hYAAAkAA
//CPhCQJwgUC3zvH8CiKs6wyB1CBpAA2jo7/+gWk4xJA3KAw0GNIAG0NCJhpMfg6FgkOQL786CnScooAAU
//gMI4eYI6GawWXHZIE2r18pxnZgyAATAAhlEyBh8stE4YnLE4zh3ABbgAF6PkDn65UL1xYcAFuAAX42YR
//blg4JRHOVNj5hAmvQQWoABVT2fFQLazyl1Bop4QCNIAG0DCZfRDnw+CaUWjHjAJgAAyAMZndEV3AUL2B
//YQAGwAAY09sz0YYLHzmFdsspjAAVoAJUDJhTWMmlz5QiILlwzCjAAlgACwNmFF5R+C+h6EpFLZ8AFsAC
//WAyYT/SEheoJCwMsgAWwGCWb6EjFOclEeyh+AWEAYnw=
