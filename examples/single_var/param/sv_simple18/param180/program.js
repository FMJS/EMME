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
outputs[1] = "id6_R_t2: 768;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 0;id7_R_t2: 2";
outputs[3] = "id6_R_t2: 768;id7_R_t2: 2";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 768";
outputs[5] = "id6_R_t2: 768;id7_R_t2: 768";
outputs[6] = "id6_R_t2: 0;id7_R_t2: 770";
outputs[7] = "id6_R_t2: 768;id7_R_t2: 770";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stKw0AUBuC9TzFLhcI0c3IRxYVFihsV6qLLIMRFwFoX6Ur67ibNhSQ90XQySdr678qZM00yKR+d
//n5FyvYm+NpGUIgxcf+FH6kZMb8PAyz9LuVoH7x9xw+NM3InvyzBQ/tKPrEk8g3afriaiUrXZqlOqEttL
//bK/NVtN7TarpnaZVK+5YvYWfSV2Vust1aqjbDXWnoe42XDe7n624f34QTy9Ys/ZrVnt6l62We4ntJbbX
//Znttttdhe516b/qOF7P57iVXVjh/unjmNJndNGhlgx43qH4bpPzy8+wnxn4/Pzud+bpMZm4vJBAAAkCg
//VwSsPQSKZZ72TwBzVW0YPPcaNIAG0NDf/4NiOa0haSDQABpAw+g07P0xGAoGxb7w7iyUtxIKKAAFoDBO
//nkB7g8WCqw5pQq2efSdgAAyA4RQyBhMstE4YtLGobi7ABbgAF6PkDma5IHABLsDFuWYRelhoJRFGtiEx
//G6ACVICKYznxUCwsmUsoHNAAGkDDaZ+DOBwG3YzC0dx0AAyAATCO5nREFzAIYAAMgPGfzky04cJETqG5
//GfFwvApUgIohc4pScmkypbBZLsACWAALx59RGEXhr4SiKxW17QawABbAYsB8oicsCFgAC2BxVtlERyoO
//SSbaQ/EDRZ5irA==
