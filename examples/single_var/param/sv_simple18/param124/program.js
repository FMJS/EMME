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
      var x = new Int8Array(data.x_sab); x[1] = 3;
      var x = new Int8Array(data.x_sab); x[2] = 1;
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
outputs[1] = "id6_R_t2: 2;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 768;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 770;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 1";
outputs[5] = "id6_R_t2: 2;id7_R_t2: 1";
outputs[6] = "id6_R_t2: 768;id7_R_t2: 1";
outputs[7] = "id6_R_t2: 770;id7_R_t2: 1";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 768";
outputs[9] = "id6_R_t2: 2;id7_R_t2: 768";
outputs[10] = "id6_R_t2: 768;id7_R_t2: 768";
outputs[11] = "id6_R_t2: 770;id7_R_t2: 768";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 769";
outputs[13] = "id6_R_t2: 2;id7_R_t2: 769";
outputs[14] = "id6_R_t2: 768;id7_R_t2: 769";
outputs[15] = "id6_R_t2: 770;id7_R_t2: 769";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2rtqwzAUBuC9T+GxhYBiybJ6oUNDCV3aQjpkNAV3MDRNB2cqeffa8QXFOW4dSb4M/xaOjnyRw4f9
//I8a2u/R7lzLmJXEYraKU33rzuyRW1W/GNtv44zNreFp4997PZRLzaB2l/iybIQ6/rmbeUTUgq1KrCrJX
//kL0BWS2uNa8WV1pU/axj85585XWudet10VIPWuqypR62nLe8nr338PLoPb9izbqvWePuQ7Kq9wqyV5C9
//AdkbkL2S7JXN3uIZrxbLw0M+WuHq7rKZ83x226BfDipqkP81KKrTL8u/GHl8enYx822dz9xfMAoBDgSA
//ABBwhYB/gkC9zPP+CSDOagyDCq9BA2gADf29H9TL6Q9Jg7CnQeHTATSABjsaTl4MhoKBkw/cngUdBR8o
//AAWgME6eIE4G6wXnFmlCo14e88yMATAABsAwSsbggoXOCYMxFse5A7gAF+BilNzBLReiLy4UPjvABbgY
//OYsww8IoiTCmQocie8sAFaACVExlx0O9sMJdQiGNEgrQABpAw2T2QZwPg2lGIQ0zCoABMADGZHZH2IAh
//+gJD4eMDYACMCe6Z6MKFi5xCGuYUN6ACVICKAXMKLbl0mVIEJBemGQVYAAtgYbiMwikK/yUUtlQ08wlg
//ASyAxXD5RE9YiH6wUPjgABbAYpxswpKKc5KJ7lD8At5wYrQ=
