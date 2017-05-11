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
      var x = new Int8Array(data.x_sab); x[1] = 0;
      var x = new Int8Array(data.x_sab); x[2] = 2;
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
outputs[1] = "id6_R_t2: 1;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 0;id7_R_t2: 2";
outputs[3] = "id6_R_t2: 1;id7_R_t2: 2";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 512";
outputs[5] = "id6_R_t2: 1;id7_R_t2: 512";
outputs[6] = "id6_R_t2: 0;id7_R_t2: 514";
outputs[7] = "id6_R_t2: 1;id7_R_t2: 514";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k1rwkAQBuB7f8UeWxDW3dlVaOmhUqSXtmAPHkMhHgK19hBPxf/exMQQddLGzeaj8N5kdtbEjTwM
//L5Fys42/trGUIgonwSKI9a0Y30Xh9PBZyvUmXH0kDU8zcS++r6NQB8sgVqNkB+0/3YzEUdWwVVuqEttL
//bK9hq9m9ptXsTrOqSjrW79FnWtel7nKdKuqmom4r6pOK6+b3sxMPL4/i+RVnVv/MTn79hK2We4ntJbbX
//sL2G7bVsrz3tzZ7xYjbfP+SjEz78umTnON1dtajyxSm3qH9bpMPl5/lfjP1+fne2822Z7txdSQ4BBQSA
//ABDwhYA6Q6A45nH7BDBXdYYB0wFgAAwtTgfFcaouYaDGMGBiAAyAoRkMZ0NBVyxo9oGT12lBAwWgABT6
//yRLobLE4cN0gSTip59954bQAGAADYOglX/DBQu10wRkLTBHAAlj0njn4xYJawgKTBbAAFj3nEG5UOKUQ
//XqYKq0AFqAAVg3nToThY8pdOWKcZAjSABtAwmPcfLofBNZ+wmCTABbj4329FNOGCWuIC0wW4ABcDfFei
//DhY+MgrXycKAClABKjrMKEqppc+EwrBcuE4QYAEsgIXu8gmvKPyVTjSlAhMEqAAVfWUTLVFBrVCBqQJU
//gIp+comGUFySStRn4gftQF7I
