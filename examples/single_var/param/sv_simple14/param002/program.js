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
outputs[1] = "id6_R_t3: 1;id7_R_t3: 0";
outputs[2] = "id6_R_t3: 256;id7_R_t3: 0";
outputs[3] = "id6_R_t3: 257;id7_R_t3: 0";
outputs[4] = "id6_R_t3: 0;id7_R_t3: 1";
outputs[5] = "id6_R_t3: 1;id7_R_t3: 1";
outputs[6] = "id6_R_t3: 256;id7_R_t3: 1";
outputs[7] = "id6_R_t3: 257;id7_R_t3: 1";
outputs[8] = "id6_R_t3: 0;id7_R_t3: 256";
outputs[9] = "id6_R_t3: 1;id7_R_t3: 256";
outputs[10] = "id6_R_t3: 256;id7_R_t3: 256";
outputs[11] = "id6_R_t3: 257;id7_R_t3: 256";
outputs[12] = "id6_R_t3: 0;id7_R_t3: 257";
outputs[13] = "id6_R_t3: 1;id7_R_t3: 257";
outputs[14] = "id6_R_t3: 256;id7_R_t3: 257";
outputs[15] = "id6_R_t3: 257;id7_R_t3: 257";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtnU1v2kAQhu/9FT62UiRjL8ZSqx4aVVEvbaX0kCOqRA9ITdMDOVX578XYAUMWiL0zsxieG1rwEj7m
//yZt5982k6cPj4u/jIk2T+WwyvZ0u3Ptk9GE+K59vp+n9w+zX7+UDvlwnH5N/b+ezfHo3XWRXyyvc6ta7
//q2S5Oq5u59VqsbpVr9Z7Vqv1jvVqtnzE/c/5n2o9b+3RXnd71set3dvrxZ71yZ7nbX6ep+TTt8/J1+/n
//+NpW65tX1N59s1p4VyfeHdr7Ou++zruv8+7rvPtu3uuJd7X92ML72GL3sfVnfHt9s/qQtz6553dteeWo
//unrfndmhO/NDd7rmzvLQc5b+52x+8Jvmy+nd3391feWPu+rKpzepr8wzypwyv7wyD6/kzZ3rD36kX+Se
//Z+1d+nkxofgpfn7HhxT/+gPOLIvfCRR/SfFT/JdX/KG/3GOXfvvLJgkE/t4HB2iBIFas3xJTILQ/CHoA
//lD6lb64E4hS+XwmE4wAlAA5QAh36hS9ZsX7xuSUQCpQApU/pC7sBnZRAnML3K4FwHOAQAAS0QA8TIDYQ
//nBoQcA0AwgUCIcwYOE19oAUJ+gcgAs3Q2SyIDYmx96tJTwEcgANtxXByMDjuLWgphgxEgAgUg1bW4KVD
//2cJS/6TBznqzZ0d1QOlT+jgOSvkDicJ/dfqgNw62HQeAABDQAkqZBFkgODUglAABIHA6UTunoKcP9CFB
///wBEoBkMsguykDhyVJmeAjgAB6ebZ7BQDFqIQDGACBSDQcZBFhIFigEcgIOh5h4sFIMWInAmgASawSAL
//oedLWEACtwJIcNpROR9h7VXog4N+BNhAW6hnJvT8C3oUIAJEDD5HYe1p2CqLvJgADsCBtrCb5ND6W0cs
//XeF6aQaKn+LH2TCc79C99PvmK1xPFwMkgAT0gOHUhxAkODUklCABJHBiMsYsCCmNoI8J+ghAAt0QaUJE
//CCa6HaGmtwAQAMKJz42QVw1akEA1AAlUQ6RpEiGYKFANAAEgnNOMCXnVoAUJXAowgW6INHlCyqOwwATO
//BZjgVGSEeRS6voU+OuhLAA70RZQpFVJeBr0KIAEkznJ2ha6/Ya0uSsABOFAXopmLA2eyQxIX/mPXfRUD
//hU/h425I5i1Ey/5Y2iIUBrsuBjgAB+gAyayFEg6cEg5KcAAOODGplLMw0AbaiKBvACDQC3oZCyVE+A9P
//00sABsDgVPMVpmpBBxCoBQCBWtDLVighokAtAANgMKhchala0AEEbgSIQC/oZSoMvAh9ROBQgAhOPOrk
//KaL5E9rYoA8BNNAVWlkKA8+C3gSAABDDzFFE8zEsVcUIZIAMNIXd1IoWi8SmVjR7dtQLlD6lj5NhNrOi
//e+H3nVnxehxsOxcAASCgBcwmVoQAwakBoQQIAIGTkfbzKqT0gT4k6B+ACDRDlGkVIZDo9o/o6SmAA3Bw
//0rMq5BWDFiJQDCACxRBlUkUIJAoUAzgAB+czp0JeMWghAmcCSKAZokypkPIlLCCBWwEkOP1oPqNC16vQ
//Bwf9CLCBtogwoULKv6BHASJAxBnOp9D1NGyVRQY2wAbKwmo6RUiywn/Aup9aoOwpexwNo9kU8qmKUBRs
//OxfAABigAYwmU8gnKsJhUAIDYMDpSOu5FFZpilBA0C8AD2iFCFMp5JMU9BBAASgY3EwKqxQFSgE8gIcB
//TqSQT1CgFEABKBjcPAqr9AQOBIAAEAOcRmGVnMCVABAAYnCzKOKmJug/gAyQMbhJFFaJCXoS4AE8DGwO
//Rdy0xOuR8R8Nc0QR
