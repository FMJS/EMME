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
      var x = new Int8Array(data.x_sab); x[0] = 1;
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
      if(id4_R_t2 <= id5_R_t2) {
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
outputs[0] = "id4_R_t2: 1;id5_R_t2: 0;id7_R_t2: 0";
outputs[1] = "id4_R_t2: 1;id5_R_t2: 0;id7_R_t2: 1";
outputs[2] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 0";
outputs[3] = "id4_R_t2: 0;id5_R_t2: 1;id6_R_t2: 0";
outputs[4] = "id4_R_t2: 1;id5_R_t2: 1;id6_R_t2: 0";
outputs[5] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 1";
outputs[6] = "id4_R_t2: 0;id5_R_t2: 1;id6_R_t2: 1";
outputs[7] = "id4_R_t2: 1;id5_R_t2: 1;id6_R_t2: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmjtvwjAUhff+iowgIQVziZFaMYBa1KEPCVoxRlXTIVKBDmGq+t+bF8VJnTYPG4I5m3VJTrDjT/f4
//KLa92QYf28C2Ld8bunM3GFxa7Mr3nHTcD8ej3di2Vxvv7T28+HZqja3Pju8N3KUbsF54N8Wjbs/q7JSi
//aqKTr46EqiOtslBt9eKvo/pAUBbrVFAfFug4BfX0uV/W5OHaun80b2ZxfT+fobTqSKuiAkkVSKpAeYVk
//defTWby8mTX7WYV+dG9m4XaTEX4cyX9M9Wfp25OoFwnLNRO9xTLSS8bx2r5u1t54Nrlb3HQvbMADeI4N
//D2mFh9oBDwM8gKdFnUe4T1HfSa8GOADH5K5TBhwCOAAHHScLDinvOARwAI75HYeUd5yG4PRz4HBFAYHu
//LbN/KpduX16gwRuDo3tmVTZ9le3dcMVy/4JLn8f/BUdCx5/o8IoRQRaTInx4tZDgaf5chh8GfsDPMfn5
//ZedU0SO+J3XsMLADdg7Izh+nncbkyE874AbcnD43pJEbOiA38GrgpjVejXR5NULPATsmezXS49XADbgx
//2quRHq9G2r2amEszcANuWpVLl/mIoGoqXeIzghrnHLADdtqUSTchR54QNOOGgRtw0/o8uv7XnmAGzJxn
//Fl3/Q08dzMCfgZlTyKGb+DNCrwE3Z5lB1/dnYAbMnGf+XN+fkWZ/huwZzLQ3eyYN2TPhbAN2jM+eSXn2
//TPBp4Mbw7JkUZ89gBsyYnj2T4uwZ/gzMmJ89k/LsGb0G3JiePZPi7BnMgBnTs2dSnD2XZeYbcYZz6w==
