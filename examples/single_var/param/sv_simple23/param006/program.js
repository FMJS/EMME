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
      var x = new Float64Array(data.x_sab); id2_R_t1 = x[0]; report.push("id2_R_t1: "+id2_R_t1.toFixed(4));
      var x = new Float32Array(data.x_sab); x[0] = 2.0000;
      var x = new Float32Array(data.x_sab); x[1] = 2.0000;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float64Array(data.x_sab); id5_R_t2 = x[0]; report.push("id5_R_t2: "+id5_R_t2.toFixed(4));
      var x = new Float32Array(data.x_sab); x[0] = 1.0000;
      var x = new Float32Array(data.x_sab); x[1] = 1.0000;
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
outputs[0] = "id2_R_t1: 0.0000;id5_R_t2: 0.0000";
outputs[1] = "id2_R_t1: 0.0078;id5_R_t2: 0.0000";
outputs[2] = "id2_R_t1: 0.0000;id5_R_t2: 2.0000";
outputs[3] = "id2_R_t1: 0.0078;id5_R_t2: 2.0000";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtnE9vmzAYh+/7FBw3KRr/jD112mHVVO2yTeoOPUaVskOkdt0hPU397iODEAdsh7SGmvDkFL0/22Aw
//j169P0McPzxu/jxu4jhar7Ll9XKTXkTJ+6T8fVyvim0g2wXi+P5h9euubPr1MvoU/X2767Eo++bLm/Lf
//u0V0EBVatGrRjlaH2EblNpq1o0qLVi3a0bT8f3+7/r1oZtCN62enx4UlXh2/G5eW49bn8xR9/v4l+vaD
//q2O6Oq3Z66Pso9LYVh9hf6X0EfZRaWyrjyCMIwjjCKI9QnWPry+v/t/kg7PczbnsmWx728TUJWYuMXeJ
//wiUWLlG6RFWL+1VnmKdRTF1i5hJzlyhcYuESpUtUu1t71Xl8tVbm3lXPnzd1zz4PXb30nt7EIBgEg2Dv
//CB4Yh4brldil1C5ldikHvYfoNS/S04AMeAEv4D2z3LeL7GbSwi4Vdoms14peNSB61QfQC3pB7ynoHT7/
//9EZVCXAdwD2+CMl0wS24DSbTla9QCyDDHbe4AIgBMSCm5HDOdttg5G2LzdLPX2C2teL1mMctOPALfsEv
//VlswVlvA2O1ttB2HMdgFu2AXoy2gMsQkwKsGBC82G+AFvNhsM8Tts2q7ZLnAFthispHdDlFWeAUMZ2AY
//DINhLLYgdj50udssVGGXCruk/Nlrwre9BnpBL+jFXpsrcp9rrQmyXZALcrHWprvDNwToqgGhe2CrAV2g
//C3Sx1c4ftT5quWS3gBbQYqmR1Y73xhoIBsEgGDvNu53WrJfELqV2KXPtNPDMWunVRMuNjyYWGrgFt1ho
//vi20mWH2mHHWG75gFsyCWWyz3gWG2YJWDQZarDJAC2ixymaB11Oqs2SxwBW4Yo+RvY5qioFdsAt2scSm
//+4aZHJHTyvvnG7HMwDE4xjKb/FtnQWL4hZ9zJCsGw2AYS21Se3YDB7EaHcRYboAYEGO5zQq/Hr8zRhYM
//fIEvlhzZbxjvq/XH8j+ExGvO
