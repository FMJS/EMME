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
      var x = new Float32Array(data.x_sab); x[0] = 0.5000;
      var x = new Float32Array(data.x_sab); x[1] = 0.5000;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float32Array(data.x_sab); x[1] = 2.0000;
      var x = new Float32Array(data.x_sab); x[2] = 2.0000;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float64Array(data.x_sab); id6_R_t3 = x[0]; report.push("id6_R_t3: "+id6_R_t3.toFixed(4));
      var x = new Float32Array(data.x_sab); id7_R_t3 = x[0]; report.push("id7_R_t3: "+id7_R_t3.toFixed(4));
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

var data = {
   x_sab : new SharedArrayBuffer(16),
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
outputs[0] = "id6_R_t3: 0.0000;id7_R_t3: 0.0000";
outputs[1] = "id6_R_t3: 2.0000;id7_R_t3: 0.0000";
outputs[2] = "id6_R_t3: 0.0000;id7_R_t3: 0.5000";
outputs[3] = "id6_R_t3: 2.0000;id7_R_t3: 0.5000";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2z1PwzAQBuCdX5ERJERaO7YlEAMIIRZAKgNjhBSGSkAZ2gnx38kXjWnPDoUmsZ2XKTrHR5y0D3bM
//xfFitXxfLeM4mmcynaVLfhpNTib5z9k8Uz8Ccfy6yJ5f8lNvLqPz6ONwnrH0MV1Oj/O+vDw6Oo7yaFIc
//syIqyqMqWmUvolXaKjrNz3h9mr8Vcabl0OPcEE+07HpcGOLS8Hvr6/mMLu6uotv7EMe2ce2MHBE9Tklm
//0PMKMq8g8woyryDzNndVz9tE9byKPFdtnls949nldfmQf2T7vmt5z0nR29Q4tTUyWyO3NSa2RmFrlLZG
//VTcq2ziVbZzKNk5Fj7O+zdf1V4m8Mrp31fPhse65y9f3IAZmwAyY9YNZx14Rt4u7TJlseWS/AQ6QATJA
//5tSsbNuq9fASc5MwNyk/EONADIgBsT0htu43Mc9upuYm1j4n2ptP0hu6dnlwgAtwAS4XZ1+yR9uUfwvI
//7mFjgA2wAbahl5Xrj0BibhLmJk9o0z/oQAyIATFflpX/9El6Qxf94AAX4AJcgS4rxzH3AmyADbAFvazc
//6b3+b9TzcLcStIE20BbIHmbo78naHxw4A2fgzMeZmuhRvGB2NrvnjvhHDjEC7sp4M6KxINiMSM/eRAUZ
//lbZ7VkY5mZeTeTmZl5N5/waxFVeUPG3PXZV57qrMc1dFSb5zqRPT/za1Fjptf2XBGlgDayh+cgC1tqIn
//mjqQBtJAmlcztR7KoJzijIMzcAbOOuMs1IKoQRD7w+tSEAbCQJjjM7JhS6OcXV52SxwDcSAOxI2kSMop
//5OgdT3AGzsCZb4vOPsulHFp0gjAQBsJGs+gMez4G4kAciBvZorOHEipndzqBHJADcsHuf4b6Pu3/VQWA
//DbABNj9mb8OWVXm2K7ov+L4AfDG1xQ==
