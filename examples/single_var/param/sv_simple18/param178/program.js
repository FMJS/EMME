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
      var x = new Int8Array(data.x_sab); x[2] = 2;
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
outputs[1] = "id6_R_t2: 768;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 0;id7_R_t2: 2";
outputs[3] = "id6_R_t2: 768;id7_R_t2: 2";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 256";
outputs[5] = "id6_R_t2: 768;id7_R_t2: 256";
outputs[6] = "id6_R_t2: 0;id7_R_t2: 258";
outputs[7] = "id6_R_t2: 768;id7_R_t2: 258";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2s1ugkAUBeB9n2KWbWIyMpdB06aLmsZ00zaxC5ekCS5Iau0CV43vXhAkiJcWhwHRnp25c4efwXxh
//TpBytY6+1pGUIgw8f+ZH6lYM78JgtPst5XIVLD7ihqeJuBff12Gg/LkfOYN4Bm1/3QzEXtVlq7pQJbaX
//2F6XrabXmlTTK02rTtyxfA8/k7oqdBfrVFF3K+q6ou5VnDe7no14eHkUz69Ys/prVrp7j60We4ntJbbX
//ZXtdtlezvbrcmz7j2WS6fch7K7y7u3jmMJldNehkgyNuUP02SLvTT7O/GHt8fnY6822ezNxcSSAABIBA
//qwg4BwjkyzxsnwDmrMYwjLwxaAANoKG994N8OZ0uaSDQABpAw8lpOHgx6AoGxT7w5iwUtxIKKAAFoHCa
//PIEOBvMFVw3ShFI9OyZgAAyA4RwyBhss1E4YjLHY31yAC3ABLk6SO9jlgsAFuAAXl5pFmGFhlETY2YZo
//D1SAClDRly8e8oUlewmFBg2gATSc93cQx8NgmlFo000HwAAYAKMvX0c0AYMABsAAGP/pm4k6XNjIKUw3
//I2NQASpARYc5RSG5tJlSuCwXYAEsgIX+ZxRWUfgroWhKRXm7ASyABbDoLp9oCQsCFsACWFxUNtGQimOS
//ifpQ/AARuWKQ
