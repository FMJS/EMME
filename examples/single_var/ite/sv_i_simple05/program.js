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
      var x = new Int8Array(data.x_sab); x[1] = 2;
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
         var x = new Int8Array(data.x_sab); id7_R_t2 = x[1]; report.push("id7_R_t2: "+id7_R_t2);
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
outputs[0] = "id4_R_t2: 1;id5_R_t2: 0;id7_R_t2: 0";
outputs[1] = "id4_R_t2: 0;id5_R_t2: 1;id7_R_t2: 0";
outputs[2] = "id4_R_t2: 1;id5_R_t2: 0;id7_R_t2: 2";
outputs[3] = "id4_R_t2: 0;id5_R_t2: 1;id7_R_t2: 2";
outputs[4] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 0";
outputs[5] = "id4_R_t2: 1;id5_R_t2: 1;id6_R_t2: 0";
outputs[6] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 1";
outputs[7] = "id4_R_t2: 1;id5_R_t2: 1;id6_R_t2: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtljtrwzAUhff+Co0JBGTZlgwtGRJa06EPcFoymlJ1MDRxB2cq/e/1M5Hdq8aqZTDlbpcj+8i61se5
//lKaH7OOQUUoS6cdRnLmXhF0lkte1k9dBU1O6S+Xbe/7w7ZosyecskW68jTO2yN/2ymq+ILPGqVArn64a
//KCoHVZa77V6SfaG7irOqexrd1/hwjV7v+0VWD9fk/vH/nazUT+fxQZWDqurggQ4e6OB1HaruRuuwbG+r
//Z8cuOMW7rcY1h1EWA2iRNf5h/fcAd50x7Fn5bbaFX1WXvX1N93IZru42N/MLCsHjKPAwhAfhGRkegBCu
//J8sUnjYmHITKIjy65HERHoRnQslz7JK13KkdbacOgoPgTCl1+oBjljkWwSlqYWlcG/vKnHYV4PUVGg8x
//GJyxT2Zy6U2u98COdb5CgPuJYeAAiwJeNIanrQuzke0peu4zsTHkB/kZmZ9fJrYfS6bswBObqtrjRpc7
//DLlBbiaVOwpW1lLHPT+0/SFzkB1kZzqZ04cbk8Tpy8w3MXiS/g==
