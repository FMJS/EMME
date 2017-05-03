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
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 2);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 2);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 2);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); Atomics.store(x, 2, 2);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id6_R_t3 = Atomics.load(x, 0); report.push("id6_R_t3: "+id6_R_t3);
      var x = new Int16Array(data.x_sab); id7_R_t3 = Atomics.load(x, 1); report.push("id7_R_t3: "+id7_R_t3);
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
      if (reports >= 3) break;
   }
}

report.sort();
report = report.join(";");
var outputs = [];
outputs[0] = "id6_R_t3: 0;id7_R_t3: 0";
outputs[1] = "id6_R_t3: 2;id7_R_t3: 0";
outputs[2] = "id6_R_t3: 512;id7_R_t3: 0";
outputs[3] = "id6_R_t3: 514;id7_R_t3: 0";
outputs[4] = "id6_R_t3: 131072;id7_R_t3: 0";
outputs[5] = "id6_R_t3: 131074;id7_R_t3: 0";
outputs[6] = "id6_R_t3: 131584;id7_R_t3: 0";
outputs[7] = "id6_R_t3: 131586;id7_R_t3: 0";
outputs[8] = "id6_R_t3: 0;id7_R_t3: 2";
outputs[9] = "id6_R_t3: 2;id7_R_t3: 2";
outputs[10] = "id6_R_t3: 512;id7_R_t3: 2";
outputs[11] = "id6_R_t3: 514;id7_R_t3: 2";
outputs[12] = "id6_R_t3: 131072;id7_R_t3: 2";
outputs[13] = "id6_R_t3: 131074;id7_R_t3: 2";
outputs[14] = "id6_R_t3: 131584;id7_R_t3: 2";
outputs[15] = "id6_R_t3: 131586;id7_R_t3: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2z9PwkAYx/HdV9FRE5LS3lGMxkFiiIua4MBITOrQRMWhTMb3bksLtHCUAndXit+NPPenlMInv+R4
//XHc6i79nses6URhMRpNY3Djd2yjsL1677uc0fP9IJjwOnDvn5zIK/cl4EnudZIWYv7rqOKWqLFSFsppd
//Ka1m18mqXjLj8y36Sut+YXaxLrbU5ZZ6L637m/Vgy3Xz9/Pr3D8/OE8v/+eO1+6ouMuqGijnFncQyh2E
//cgeh3EEqd5DKHaRyh2zd+txVtfSMR4Ph/CGXntHi80lWdtPV2wa9qkG/alDkg/2qlX31yvyND/Mvp3J/
//9eps5es4X7nPD+LCVVHhQwVUQIUuDVaDy0fcNQ+F4qp781HNRM8DCqAAijqZYk8olo/SswmFMAaFBAqg
//AAo9oaFpJnzll1CQMsADPNqUMmQjfEhSBlAARXtShjyhlGEKD0943T5BAz/w4+gjkk1cljfk2xSk+DFq
//t4KsgRVYcRgHFVmjGSnUWcOgH71r/MAP/KiTNWqcjjTth7DvR4Af+IEfOg5NTjN9CDIJpmBKWzKJPDVV
//JJkEP/CjHZlEtiOT2DWl2LHiwwmcEEfsdqxsDhYwOrxfZa2e77m7i6VGtwpMwAQnMVa7VXQgUbtXZTcd
//tf5FChMwQZqw2quilwlhjAkJEzABE810qpjLEjboIGFAB3Q01qeiFw9JwoAJmDi3LhUbCcMUHRs9KuiB
//HoQMqz0qev3YcXJ6nBTkDKRAioY6VGzkDIN6lP8Lih7oQc6w2J9i7rDEkh4BeqAHejTRnWL7DIU8giiI
//ct69KeaOVsgj6IEe59yZYvvERacof5fWqlQ=
