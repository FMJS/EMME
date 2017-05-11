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
      var x = new Int16Array(data.x_sab); id2_R_t1 = Atomics.load(x, 0); report.push("id2_R_t1: "+id2_R_t1);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 0);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 0);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int16Array(data.x_sab); id5_R_t2 = Atomics.load(x, 0); report.push("id5_R_t2: "+id5_R_t2);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 2);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 2);
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
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmk1LwzAch+9+ihwVCmm6rAXFg0OGFxXmYccizEPBOQ/dSfbdTe1blqb2LWk7+N3CL8m/aVIeykMo
//PRzj72NMKYl2XrgJY3ZL3Ltot0zanmhTuj/sPj7FgKcVuSc/1/k4R8xYhFvRunHIWcqlNB2hpmn1JPWT
//1FPTQErTEWrKRHv/Hn05xbqrubw6Oec1efr8au7XPDdbz4k8vDyS51fsjm53lLeXq5Sprx0rVyh3Sq5Q
//pr52rFyBaytwbQWuVkjPeLNa/x3y2SrzdxYz3WR2XSfLOstz1MzUdrL88evKJyaN0s9OZ75ts5ltPoxs
//e05XVAcHD3AAHACH7nBgFTgURV37aNBvZzdg/A+GJQMagAagwch/Q7EANiYaAmto4EAD0AA0tERD5cdg
//LDA0b5pJLMAzAAqAwqieodpZHI87wDIoeVaz2T3AMQAMAMP0jsEEFlobhmZYwDAADADDHAyDWTAE1sAA
//vwAwAAyj+YV+WOhlF3pDAXYBSAASJr7FUBwDM2cXOOwCwAAwXPINhu5Y6GsXOOwCwAAwXMr9hSFgCKyB
//AXYBYAAYJry90AYLJuwCh10AEoCEGdkFySuadAsL7acEswAoAApzNwtGkdDkFVqDAlYBUAAUJrMKlqAQ
//WIICjAKgACjYNQoDkdDFJ7QHwi+1ITAg
