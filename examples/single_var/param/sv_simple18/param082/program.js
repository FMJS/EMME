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
      var x = new Int8Array(data.x_sab); x[0] = 0;
      var x = new Int8Array(data.x_sab); x[1] = 1;
      var x = new Int8Array(data.x_sab); x[2] = 1;
      var x = new Int8Array(data.x_sab); x[3] = 1;
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
outputs[1] = "id6_R_t2: 256;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 0;id7_R_t2: 1";
outputs[3] = "id6_R_t2: 256;id7_R_t2: 1";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 256";
outputs[5] = "id6_R_t2: 256;id7_R_t2: 256";
outputs[6] = "id6_R_t2: 0;id7_R_t2: 257";
outputs[7] = "id6_R_t2: 256;id7_R_t2: 257";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stKw0AUBuC9TzFLhcI0czIpKC4sUtyoUBddBiFdBKx1ka6k727SXEjSE00nk/TivytnzuQyKR+Z
//n0i53kRfm0hKEQaeP/cjdSvGd2EwyX9LuVoHy4+44Wkq7sX3dRgof+FHziieQbtfNyNRqbpsVZeqxPYS
//2+uy1fRak2p6pWnViTtW7+FnUlel7nKdGupuQ1031L2G82bXsxUPL4/i+RVr1n7NanfvsdVyL7G9xPa6
//bK/L9mq2V9d702c8n852D7mywvndxTPHyeymQScbnHCD6rdByk8/y/5i7PH52enMt0Uyc3slgQAQAAK9
//IuDsIVAs87h/ApizGsOgtAcaQANo6O/9oFhOZ0gaCDSABtBwdBr2XgyGgkGxD7w7C+WthAMUgAJQOE6e
//QHuDxYKrDmlCrZ4dEzAABsBwDhmDDRZaJwzGWFQ3F+ACXICLo+QOdrkgcAEuwMWlZhFmWBglEVa2ITEb
//oAJUgIpT+eKhWFiyl1Bo0AAaQMN5fwdxOAymGYU23HQADIABME7m64guYBDAABgA4z99M9GGCxs5helm
//ZAIqQAWoGDCnKCWXNlMKl+UCLIAFsHD6GYVVFP5KKLpSUd9uAAtgASyGyyd6woKABbAAFheVTXSk4pBk
//oj0UP3V2Ykg=
