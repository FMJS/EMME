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
      var x = new Int8Array(data.x_sab); x[1] = 2;
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
outputs[1] = "id6_R_t2: 2;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 512;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 514;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 1";
outputs[5] = "id6_R_t2: 2;id7_R_t2: 1";
outputs[6] = "id6_R_t2: 512;id7_R_t2: 1";
outputs[7] = "id6_R_t2: 514;id7_R_t2: 1";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 256";
outputs[9] = "id6_R_t2: 2;id7_R_t2: 256";
outputs[10] = "id6_R_t2: 512;id7_R_t2: 256";
outputs[11] = "id6_R_t2: 514;id7_R_t2: 256";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 257";
outputs[13] = "id6_R_t2: 2;id7_R_t2: 257";
outputs[14] = "id6_R_t2: 512;id7_R_t2: 257";
outputs[15] = "id6_R_t2: 514;id7_R_t2: 257";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stKw0AUBuC9TzFLhcJ0bikoLixS3KhQF10GIS4C1rpIV9J3N2kuTNMTTSeTy+LfhTNncpmEj/Az
//nO/2yfc+4ZzFURCuw0TesvldHC3KY863u+jjM214WrJ79nMdRzLchImYpTPU8ehmxk6qmqwaq6rIXkX2
//arKa32tWze80r4q0Y/sef2V1aXXbddVQ1w1101APGq5b3M+BPbw8sudXrFn7Nas9fUBW7V5F9iqyV5O9
//muw1ZK+p9+bveL1cHV/yyQqXT5fOnGezmwZFMbigBuVfg6q8/Kr4xMjz07PzmW+bbObhilMISCAABICA
//LwTEGQLVMs/7J4C4qjMMRoAG0AAaevw/qJZTDEmD8kCDBg2gATR0ouHsx2AoGCT5wruzYOcJAigABaAw
//Tp6gzgarBZcd0oRavTjnhRkDYAAMgGGUjMEHC60TBmcsTnMHcAEuwMUouYNfLlRvXGhwAS7AxbhZhBsW
//TkmEMxV2PiFNACpABaiYyo6HamGVv4TCOCUUoAE0gIbJ7IO4HAbXjMI4ZhQAA2AAjMnsjugChuoNDA0w
//AAbAmN6eiTZc+MgpjGNOsQAVoAJUDJhTWMmlz5RCk1y4ZhRgASyAheEyCq8o/JdQdKWink8AC2ABLIbL
//J3rCQvWEhQYWwAJYjJJNdKTikmSiPRS/rRFiMA==
