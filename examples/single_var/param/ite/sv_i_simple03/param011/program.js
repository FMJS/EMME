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
      var x = new Int8Array(data.x_sab); x[0] = 0;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id4_R_t2 = x[0]; report.push("id4_R_t2: "+id4_R_t2);
      var x = new Int8Array(data.x_sab); id5_R_t2 = x[0]; report.push("id5_R_t2: "+id5_R_t2);
      if(id4_R_t2 == id5_R_t2) {
         var x = new Int8Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      } else {
         var x = new Int8Array(data.x_sab); id7_R_t2 = x[0]; report.push("id7_R_t2: "+id7_R_t2);
      }
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
outputs[0] = "id4_R_t2: 2;id5_R_t2: 0;id7_R_t2: 0";
outputs[1] = "id4_R_t2: 0;id5_R_t2: 2;id7_R_t2: 0";
outputs[2] = "id4_R_t2: 2;id5_R_t2: 0;id7_R_t2: 2";
outputs[3] = "id4_R_t2: 0;id5_R_t2: 2;id7_R_t2: 2";
outputs[4] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 0";
outputs[5] = "id4_R_t2: 2;id5_R_t2: 2;id6_R_t2: 0";
outputs[6] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 2";
outputs[7] = "id4_R_t2: 2;id5_R_t2: 2;id6_R_t2: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmk9rwjAYxu/7FD1OEKp5bYQND8omO+wP6IZHGesOhak71NPYd19b66zyhtkmkZg9t/DWPjWxP/I+
//jwnD1Tr9XKdhGCRxbz6Zp+IqENdJHJXjTjbub8dhuFjF7x/Zh+9GwSD4ukxiMZ/N0247u5uKUasdXG6V
//8upG57Dar1QjttrN1BavyTKvi4pytU6Kek+hEynq5XO/g+HjTfDw5N/MivpuPj22GrHVqgKxCsQq0KHC
//ZnUno3GxvHtr9rsKnfzevYXbTqZysc9fLPXH5a/HqKuEec2N3nSW623Gxdq+rZbxYDy8n962LkIOnk4F
//HgF4AI9leBhCIjVZdeHZxyRioQI8gOdM4SH1zqONDrH7jiVw0LIBHEdaNtIFh2/Y6LTgCIADcBzyOpX7
//DDmd8tOmWzWAA3Bc8jnHgFPP5QAcgOO9xzkGmzoORxMatGmAxn1/07xJo1NCg1AA0Ljkbci4tyE7LRrA
//ATgueRsy7m0ADsDx3tuQYW9DaNMAje/ehgx7G4M7TT6WhqCx/brsnirZV1cqNKQ2NLZnVueFr/Nqa67Y
//wbeQ7POkXovGXJSGDtrs12W9Pz6fJy/gB/y4wA/VygakkbM2ttgRBy4H7IAdm+yIGi5HGjlsU61izwE3
//HvZspEuOqmMjsAN2fO7XtMmhP2MC+9wIcANunMoJdA6qqZzOEQcIwA7YOfOMoPlZNTvcqPIBcANu3MkH
//mh9W49MB7DVgxv9sQKdLI3ADbv5lLtC8QzslM8jSwIxbmQBZyAQI7IAd7zMBMp4JkJVMANyAG3cyATKc
//CWCvATP+ZwJkPBMAN+DG90yADGcCxzLzA73fdS8=
