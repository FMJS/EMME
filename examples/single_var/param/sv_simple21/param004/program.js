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
      var x = new Int8Array(data.x_sab); x[0] = 0;
      var x = new Int8Array(data.x_sab); x[1] = 0;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int16Array(data.x_sab); id5_R_t2 = x[0]; report.push("id5_R_t2: "+id5_R_t2);
      var x = new Int8Array(data.x_sab); x[0] = 1;
      var x = new Int8Array(data.x_sab); x[1] = 1;
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
outputs[1] = "id2_R_t1: 1;id5_R_t2: 0";
outputs[2] = "id2_R_t1: 256;id5_R_t2: 0";
outputs[3] = "id2_R_t1: 257;id5_R_t2: 0";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmk9rgzAYxu/7FDluIMTYVGFjh5VRdtkG3aFHGbQHYV13sKfR7764+CfVSDUm1sJzC0/yvsbE9yd5
//CKX7Q/pzSCklySaIV3HK7on/kGzmWTsQbUp3+832Swx4WZBH8ntbjPNExCxei9adR05UrqhyRF2V2TM1
//zNSgrkaKKkfUVSbau8/k2yvn3dTV2ak6b9Hl85t62PLcfD5H8vT2TF7fsTq61am9vZqlUkPtWDVDtVJq
//hkoNtWPVDFybgWsz8HoGucerxfJ/k09mWbyziPSz6LZOlndW+6iJ1Hay4vHLxiemjNJHy8iPdRZ5vKG6
//cmcod5Q7yr1/ubNGuZdJfffFrl9OMwQE8xAQAAQAARv//HICbEwIRBYgEAECgAAg0BECjZ/9WAg4v2hm
//AMC5H+WP8h/13N/sLLfHH3Dqr+l5TngBQAAQMC0vwAYAOjsBxliAPwAwAAyj+gN2wRA5AwM8A4ABYBjN
//MzDDgpFjYAwF+AhAApBw4fsD5TYwez4Ch48ABAAB13GnoD8ATH0EDh8BYAAYruWewRAwRM7AAB8BYAAY
//Lnj3oAsWbPgIHD4CkAAkTMhHUBxEmy7CTPspwUNA+aP8p+MhWC3+cw7CUCTAPwAUAAX3/oEjKESOoADv
//AFAAFNx6BwOR0Mc56A6EP8BH940=
