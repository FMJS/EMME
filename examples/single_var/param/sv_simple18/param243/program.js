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
      var x = new Int8Array(data.x_sab); x[1] = 3;
      var x = new Int8Array(data.x_sab); x[2] = 3;
      var x = new Int8Array(data.x_sab); x[3] = 2;
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
outputs[1] = "id6_R_t2: 768;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 0;id7_R_t2: 3";
outputs[3] = "id6_R_t2: 768;id7_R_t2: 3";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 512";
outputs[5] = "id6_R_t2: 768;id7_R_t2: 512";
outputs[6] = "id6_R_t2: 0;id7_R_t2: 515";
outputs[7] = "id6_R_t2: 768;id7_R_t2: 515";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stKw0AUBuC9TzFLhcI0czKpKC4sUtyoUBddBiEuAta6SFfSdzdpLqTpiaaTSdLWf1fOnMllUj4y
//P5FytY6+1pGUIgw8f+5H6kaMb8Ngkv+WcrkK3j/ihsepuBPfl2Gg/IUfOaN4Bm1/XY3ETtVlq7pUJbaX
//2F6XrabXmlTTK02rTtyxfAs/k7oqdZfrVFN3a+q6pu7VnDe7no24f34QTy9Ys+ZrVrl7j62We4ntJbbX
//ZXtdtlezvbramz7j+XS2fcg7K5zfXTxznMyuG3SywQk3qH4bpPz0s+wvxh6fn53OfF0kMzcXEggAASDQ
//KQLOHgLFMo+7J4A5qzEME+8aNIAG0NDd+0GxnE6fNBBoAA2gYXAa9l4M+oJBsQ+8PQvlrQQBBaAAFIbJ
//E2hvsFhw1SJNqNSzYwIGwAAYTiFjsMFC44TBGIvdzQW4ABfgYpDcwS4XBC7ABbg41yzCDAujJMLKNkQ7
//ClSAClBxLF88FAtL9hIKDRpAA2g47e8gDofBNKPQhpsOgAEwAMbRfB3RBgwCGAADYPynbyaacGEjpzDd
//jGhQASpARY85RSm5tJlSuCwXYAEsgIXjzyisovBXQtGWiup2A1gAC2DRXz7RERYELIAFsDirbKIlFYck
//E82h+AEB/2Jw
