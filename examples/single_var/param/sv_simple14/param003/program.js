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
      var x = new Int8Array(data.x_sab); x[1] = 2;
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
      var x = new Int16Array(data.x_sab); id7_R_t3 = x[0]; report.push("id7_R_t3: "+id7_R_t3);
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
outputs[4] = "id6_R_t3: 0;id7_R_t3: 2";
outputs[5] = "id6_R_t3: 2;id7_R_t3: 2";
outputs[6] = "id6_R_t3: 512;id7_R_t3: 2";
outputs[7] = "id6_R_t3: 514;id7_R_t3: 2";
outputs[8] = "id6_R_t3: 0;id7_R_t3: 512";
outputs[9] = "id6_R_t3: 2;id7_R_t3: 512";
outputs[10] = "id6_R_t3: 512;id7_R_t3: 512";
outputs[11] = "id6_R_t3: 514;id7_R_t3: 512";
outputs[12] = "id6_R_t3: 0;id7_R_t3: 514";
outputs[13] = "id6_R_t3: 2;id7_R_t3: 514";
outputs[14] = "id6_R_t3: 512;id7_R_t3: 514";
outputs[15] = "id6_R_t3: 514;id7_R_t3: 514";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtnU1v2kAQhu/9FT62UiRjrw1Sqx4aVVEvbaX0kCOqRA9ITdMDOVX578WYgCELxN6ZWRueG1rwEj7m
//yZt5982k6cPj4u/jIk2T+Ww8vZ0u3Ptk9GE+mzzfTtP7h9mv38sHfLlOPib/3s5n+fRuusiulle41a13
//V8lytahu59VqubpVr9Z7Vqv1jvVqtnzE/c/5n2o9b+zRXHcH1ovG7s318sD6+MDzrn+ep+TTt8/J1+/n
//+NpW69tX1Nx9u1p6V8feHZr7Ou++zruv8+7rvPtu3+uxd7X52NL72HL/sfVnfHt9s/qQdz6553dteeWo
//uvrQndmxO/Njd7r1nZNjzznxP+f6B79Zfzm9+/uvrq/8cVdd+fQm9ZV5TplT5pdX5uGVvL1z88GP9Ivc
//86ydS7/MKH6Kn9/xQcW/+YAzy+J3AsVfUPwU/+UVf+gv99il3/yySQKBv/fBAVogiBWbt8QUCM0Pgh4A
//pU/pmyuBOIXvVwLhOEAJgAOUQIt+4UtWbF58bgmEEiVA6VP6wm5AKyUQp/D9SiAcBzgEAAEt0MEEiA0E
//pwYEXAOAcIFACDMG+qkPtCBB/wBEoBlamwWxIVF4v5r0FMABONBWDL2DwWlvQUsx5CACRKAYtLIGLx3K
//Bpa6Jw321td7tlQHlD6lj+OglD+QKPxXpw8642DXcQAIAAEtoJRJkAWCUwNCARAAAqcTtXMKevpAHxL0
//D0AEmsEguyALiRNHlekpgANw0N88g4Vi0EIEigFEoBgMMg6ykChRDOAAHAw192ChGLQQgTMBJNAMBlkI
//PV/CAhK4FUCC047K+Qhrr0IfHPQjwAbaQj0zoedf0KMAESBi8DkKa0/DVlmUGeAAHGgLw0kOjb91xNIV
//rpNmoPgpfpwNw/kO7Uu/a77CdXQxQAJIQA8YTn0IQYJTQ0IBEkACJyZjzIKQ0gj6mKCPACTQDZEmRIRg
//ot0RanoLAAEg9HxuhLxq0IIEqgFIoBoiTZMIwUSJagAIAOGcZkzIqwYtSOBSgAl0Q6TJE1IehQUmcC7A
//BKciI8yj0PUt9NFBXwJwoC+iTKmQ8jLoVQAJIHGWsyt0/Q1rdVEADsCBuhDNXBw5kx2SuPAfu+6qGCh8
//Ch93QzJvIVr2p9IWoTDYdzHAAThAB0hmLZRw4JRwUIADcMCJSaWchYE20EYEfQMAgV7Qy1goIcJ/eJpe
//AjAABn3NV5iqBR1AoBYABGpBL1uhhIgStQAMgMGgchWmakEHELgRIAK9oJepMPAi9BGBQwEiOPGok6eI
//5k9oY4M+BNBAV2hlKQw8C3oTAAJADDNHEc3HsFQVI5ABMtAUdlMrGiwSm1qx3rOlXqD0KX2cDLOZFe0L
//v+vMitfjYNe5AAgAAS1gNrEiBAhODQgFQAAInIy0n1chpQ/0IUH/AESgGaJMqwiBRLt/RE9PARyAg17P
//qpBXDFqIQDGACBRDlEkVIZAoUQzgABycz5wKecWghQicCSCBZogypULKl7CABG4FkOD0o/mMCl2vQh8c
//9CPABtoiwoQKKf+CHgWIABFnOJ9C19OwVRaMtQEbKAuz6RQhyQr/AetuaoGyp+xxNIxmU8inKkJRsOtc
//AANggAYwmkwhn6gIh0EBDIABpyOt51JYpSlCAUG/ADygFSJMpZBPUtBDAAWgYHAzKaxSFCgF8AAeBjiR
//Qj5BgVIABaBgcPMorNITOBAAAkAMcBqFVXICVwJAAIjBzaKIm5qg/wAyQMbgJlFYJSboSYAH8DCwORRx
//0xKvR8Z/2/RDaQ==
