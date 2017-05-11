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
      var x = new Int16Array(data.x_sab); id2_R_t1 = x[0]; report.push("id2_R_t1: "+id2_R_t1);
      var x = new Int8Array(data.x_sab); x[0] = 1;
      var x = new Int8Array(data.x_sab); x[1] = 1;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int16Array(data.x_sab); id5_R_t2 = x[0]; report.push("id5_R_t2: "+id5_R_t2);
      var x = new Int8Array(data.x_sab); x[0] = 2;
      var x = new Int8Array(data.x_sab); x[1] = 2;
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
outputs[0] = "id2_R_t1: 0;id5_R_t2: 0";
outputs[1] = "id2_R_t1: 2;id5_R_t2: 0";
outputs[2] = "id2_R_t1: 512;id5_R_t2: 0";
outputs[3] = "id2_R_t1: 514;id5_R_t2: 0";
outputs[4] = "id2_R_t1: 0;id5_R_t2: 1";
outputs[5] = "id2_R_t1: 2;id5_R_t2: 1";
outputs[6] = "id2_R_t1: 512;id5_R_t2: 1";
outputs[7] = "id2_R_t1: 514;id5_R_t2: 1";
outputs[8] = "id2_R_t1: 0;id5_R_t2: 256";
outputs[9] = "id2_R_t1: 2;id5_R_t2: 256";
outputs[10] = "id2_R_t1: 512;id5_R_t2: 256";
outputs[11] = "id2_R_t1: 514;id5_R_t2: 256";
outputs[12] = "id2_R_t1: 0;id5_R_t2: 257";
outputs[13] = "id2_R_t1: 2;id5_R_t2: 257";
outputs[14] = "id2_R_t1: 512;id5_R_t2: 257";
outputs[15] = "id2_R_t1: 514;id5_R_t2: 257";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmk9rgzAYxu/7FDluIMTYqLCxw8oou2yD7tCjDNqDsK472NPod5/OfzGJVGOil+cWnuR9jYnvT/IQ
//Sk/n7OecUUrSfZBsk4zdE/8h3YdFO8jblB5P+8NXPuBlTR7J7209zssjVskub915pKNyQS1HyGqZvVCj
//Qg1kNRbUcoSssrx9/Ey/vWbeqi7OTtR5j14+X9WjnudW87mQp7dn8vqO1dGtjvT2YpZWjbRjxQztSokZ
//WjXSjhUzcG0Grs3A5QzlHm/Xm/9N7syyfuc80i+i+zpZ1dnuoyZS28nqx2+UT0wYpY8uIz92ReTlhurK
//PUC5o9xR7uPLnSnl3iT13Re7fjnNEBAyQAAQAASs/PObCbA5IRBbgAAHBAABQGAgBJSf/VwIuL5oZgAQ
//z/0M5Y/yR/m7Pvernc32+BNO/ZJe5RzpBQABQAAQ4NgLsAGAwU6AMRa6/gDAADAADI79AbtgiJ2BgQMM
//AAPAMJdnYIYFI8fAGAqijxCEEaAAKAAK898gaLaB2XMSuJGTAAgAAoDAAvcKxiPA1Evghl4C0AA0AA0L
//3DaYgobYGRo40AA0AA1L3kEYAgYbfgI39BNiQAFQABSc+AmCl2jTTVhpPyVTLwEAAAAAABdegtXyv+Yk
//TIWC7CMAC8ACsODCR3CEhdgRFjiwACwAC449hIlQGOMgDEfCH121+t0=
