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
      var x = new Int8Array(data.x_sab); x[1] = 1;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); x[1] = 0;
      var x = new Int8Array(data.x_sab); x[2] = 0;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id6_R_t3 = x[0]; report.push("id6_R_t3: "+id6_R_t3);
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
outputs[0] = "id6_R_t3: 0";
outputs[1] = "id6_R_t3: 1";
outputs[2] = "id6_R_t3: 256";
outputs[3] = "id6_R_t3: 257";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmEFrwyAYhu/7FR5bKBi1djDYYaWUXbZBd+gxDLJDYF17SE+j/31qWiOtCTExawfvTV4/vxh9fGM+
//Srf7YrcvKCV5NktXaSEeSELpZpt9finxeU4eyc8oz3i6Tgs2UVHCtMYTotSpbnOtStMqVabam4/8W+vc
//iXZ1UaNPa/LU5S/nPD6Qp9cFeXn7H7M1ejVHN0ulSq/qZhDeDMKbQXgzVCviqvJcLVd3NV+a5R2ddB1x
//ejs1MtGj6zpZUydv6rSPXx431xNVRryvdcThjvqgZoAaUIdD3Yfb8067EUkLpM2kL8a2AJ3LGVAH6pH9
//OxB1u+AsHHURgPo9UAfq4ah3N+6YoLtb2AV/3NMB/5V93r5QB/yPY3F3B+i37vJ9MPe7fHv44fKA/0+r
//MZcnw06dh+Mv4fIA/WoVmiCX74O53+Xbw4+qDfCP7/ONhZmY+Ive+KOSA/w74N+1WDO89/c9Erj340AM
///z1w/mxjHgl3KfAvAPhv8WswEPqN9Z4WB+IXATBvYw==
