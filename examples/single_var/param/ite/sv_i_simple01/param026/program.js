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
      var x = new Int8Array(data.x_sab); x[0] = 2;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id3_R_t2 = x[0]; report.push("id3_R_t2: "+id3_R_t2);
      if(id3_R_t2 == 1) {
         var x = new Int8Array(data.x_sab); x[0] = 0;
      } else {
         var x = new Int8Array(data.x_sab); x[1] = 0;
      }
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int16Array(data.x_sab); id6_R_t3 = x[0]; report.push("id6_R_t3: "+id6_R_t3);
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
      if (reports >= 3) break;
   }
}

report.sort();
report = report.join(";");
var outputs = [];
outputs[0] = "id3_R_t2: 0;id6_R_t3: 0";
outputs[1] = "id3_R_t2: 2;id6_R_t3: 0";
outputs[2] = "id3_R_t2: 0;id6_R_t3: 2";
outputs[3] = "id3_R_t2: 2;id6_R_t3: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtljsPgjAUhXd/RUdJSGpLdNA4SJQ4+EhwcCRGHEgUHGAy/ndbKlAtPqA1iul2c9pz+8iXkwthlMTH
//JIYQBL7luV6M+6AzCPwerS1SQ3iI/N2ebJjaYAhO7WyfSRxdb00qwwRERaQ+bIKQ6pjqSNSZU9Qf9WG3
//MM5gtBiD+fJb56c663nfpVD5HoXKdyjuzavMJ7zWtZ30uTe+7G7E2aHudmaqsoiyExzhP7ld5W7mXK2p
//k9Xpj22j0B86o9lqYrRgGVJYI/WjSOXv+ghQ/K8pxIlPKKxxamBCIWGRA7F+Pt3p154qUktj1rzUqgfZ
//i8xSi5ietf5v1spvh9Ql2bWnnr/0/PU+ZNWSTBIxPZM1Msme8CeTY+XoKUwxjVhDUkwSsHKQJPG6ALgl
//kFw=
