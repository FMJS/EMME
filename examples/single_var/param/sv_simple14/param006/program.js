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
      var x = new Int8Array(data.x_sab); x[1] = 1;
      var x = new Int8Array(data.x_sab); x[2] = 1;
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
outputs[4] = "id6_R_t3: 256;id7_R_t3: 0";
outputs[5] = "id6_R_t3: 258;id7_R_t3: 0";
outputs[6] = "id6_R_t3: 65536;id7_R_t3: 0";
outputs[7] = "id6_R_t3: 65538;id7_R_t3: 0";
outputs[8] = "id6_R_t3: 66048;id7_R_t3: 0";
outputs[9] = "id6_R_t3: 66050;id7_R_t3: 0";
outputs[10] = "id6_R_t3: 65792;id7_R_t3: 0";
outputs[11] = "id6_R_t3: 65794;id7_R_t3: 0";
outputs[12] = "id6_R_t3: 0;id7_R_t3: 2";
outputs[13] = "id6_R_t3: 2;id7_R_t3: 2";
outputs[14] = "id6_R_t3: 512;id7_R_t3: 2";
outputs[15] = "id6_R_t3: 514;id7_R_t3: 2";
outputs[16] = "id6_R_t3: 256;id7_R_t3: 2";
outputs[17] = "id6_R_t3: 258;id7_R_t3: 2";
outputs[18] = "id6_R_t3: 65536;id7_R_t3: 2";
outputs[19] = "id6_R_t3: 65538;id7_R_t3: 2";
outputs[20] = "id6_R_t3: 66048;id7_R_t3: 2";
outputs[21] = "id6_R_t3: 66050;id7_R_t3: 2";
outputs[22] = "id6_R_t3: 65792;id7_R_t3: 2";
outputs[23] = "id6_R_t3: 65794;id7_R_t3: 2";
outputs[24] = "id6_R_t3: 0;id7_R_t3: 512";
outputs[25] = "id6_R_t3: 2;id7_R_t3: 512";
outputs[26] = "id6_R_t3: 512;id7_R_t3: 512";
outputs[27] = "id6_R_t3: 514;id7_R_t3: 512";
outputs[28] = "id6_R_t3: 256;id7_R_t3: 512";
outputs[29] = "id6_R_t3: 258;id7_R_t3: 512";
outputs[30] = "id6_R_t3: 65536;id7_R_t3: 512";
outputs[31] = "id6_R_t3: 65538;id7_R_t3: 512";
outputs[32] = "id6_R_t3: 66048;id7_R_t3: 512";
outputs[33] = "id6_R_t3: 66050;id7_R_t3: 512";
outputs[34] = "id6_R_t3: 65792;id7_R_t3: 512";
outputs[35] = "id6_R_t3: 65794;id7_R_t3: 512";
outputs[36] = "id6_R_t3: 0;id7_R_t3: 514";
outputs[37] = "id6_R_t3: 2;id7_R_t3: 514";
outputs[38] = "id6_R_t3: 512;id7_R_t3: 514";
outputs[39] = "id6_R_t3: 514;id7_R_t3: 514";
outputs[40] = "id6_R_t3: 256;id7_R_t3: 514";
outputs[41] = "id6_R_t3: 258;id7_R_t3: 514";
outputs[42] = "id6_R_t3: 65536;id7_R_t3: 514";
outputs[43] = "id6_R_t3: 65538;id7_R_t3: 514";
outputs[44] = "id6_R_t3: 66048;id7_R_t3: 514";
outputs[45] = "id6_R_t3: 66050;id7_R_t3: 514";
outputs[46] = "id6_R_t3: 65792;id7_R_t3: 514";
outputs[47] = "id6_R_t3: 65794;id7_R_t3: 514";
outputs[48] = "id6_R_t3: 0;id7_R_t3: 256";
outputs[49] = "id6_R_t3: 2;id7_R_t3: 256";
outputs[50] = "id6_R_t3: 512;id7_R_t3: 256";
outputs[51] = "id6_R_t3: 514;id7_R_t3: 256";
outputs[52] = "id6_R_t3: 256;id7_R_t3: 256";
outputs[53] = "id6_R_t3: 258;id7_R_t3: 256";
outputs[54] = "id6_R_t3: 65536;id7_R_t3: 256";
outputs[55] = "id6_R_t3: 65538;id7_R_t3: 256";
outputs[56] = "id6_R_t3: 66048;id7_R_t3: 256";
outputs[57] = "id6_R_t3: 66050;id7_R_t3: 256";
outputs[58] = "id6_R_t3: 65792;id7_R_t3: 256";
outputs[59] = "id6_R_t3: 65794;id7_R_t3: 256";
outputs[60] = "id6_R_t3: 0;id7_R_t3: 258";
outputs[61] = "id6_R_t3: 2;id7_R_t3: 258";
outputs[62] = "id6_R_t3: 512;id7_R_t3: 258";
outputs[63] = "id6_R_t3: 514;id7_R_t3: 258";
outputs[64] = "id6_R_t3: 256;id7_R_t3: 258";
outputs[65] = "id6_R_t3: 258;id7_R_t3: 258";
outputs[66] = "id6_R_t3: 65536;id7_R_t3: 258";
outputs[67] = "id6_R_t3: 65538;id7_R_t3: 258";
outputs[68] = "id6_R_t3: 66048;id7_R_t3: 258";
outputs[69] = "id6_R_t3: 66050;id7_R_t3: 258";
outputs[70] = "id6_R_t3: 65792;id7_R_t3: 258";
outputs[71] = "id6_R_t3: 65794;id7_R_t3: 258";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtnU1v00AQhu/8ihxBquTE63UCiAMVqrgAUjn0GCGFQyRKOaQn1P9OvpqsnU1ae2dmK/Lcok28aeLO
//03eZeXmL4u5+8ed+URSD+ayeXk8X7t1g+H4+Gz8+Lorbu9nPX8sXfL4cfBj8fT2fldOb6WJ0sbzCrR+9
//uRgsV6vV43K16tePNqubPVermx03q6PlK25/zH+v1stgj3DdHVmvgt3DdX9kvT7yvtuf52Hw8eunwZdv
///+NnW6/vP1G4+37VR1fr6A7hvi66r4vu66L7uui++++6jq6Gr/XR1/r2azf3+Pryan2TG3fu8VtbXjlc
//XX3sydGpJ8tTT7rtk+NT7zmOv+f2B7/a/nJG949fvbny+83qyodXRazMS8qcMj+/Mk+v5P2Tuxs/1C/y
//yLv2Ln0/ovgpfv7GJxX/7gaPLIvfCRR/RfFT/OdX/Kl/3HOXfvjLJgmE0tcAASCgBlJosftKTJEQ3oi+
//xT+h+Cl+1EB/NZCn9ONqIB0ItfcOPQAS0AMd/t3wkBe7D19aQsGLlD+KgPKnM5CgCPIUf1wRCCChHlYg
//ASSgCDq3BHIjwekhwTMmBBLOEAlpjYKXqRHUMOHHb5k0ABMoh87tg9ygqKK/mjJIYP4AJKAcOjYVXqZy
//0MJEeLgoQQSIQDVoeRAOu5YBlvo7EFrr2z07+hIofUqf7oOSL0Gi8J/tSuiNg6ZXASAABLSAkldBFghO
//DQgVQAAITCxq+xf09IE+JJqeBiABJFANSp4GWUw8McCcAIQJQAAIqAZtn4OFatCCRNv7ACbABLpByfsg
//CwqviASUA0igI6Huh7BQDmqYaHkkwASYQDmoeCT0uhQmmPCMNoEJph+VfRPWvQuLg0jTSwE6QAcKQ8VL
//odfRsMEE8xFgAoWh7K+w7nPooyM8mPgR4AAc6AvD5IfgzCPmunC9XBcUP8VPl8MwD6J76ff1XbievguQ
//ABLQA4YpESlIcGpIqEACSGCKMkd2hJRG0MdE03sBJsAEysEwUSIFFN0Gq11P9wVIAAkoB7OcCXnloIWJ
//tv8CUAAKtINh+kQKKrwiFFAPQIHuRJZMCnn1oAaKlgcDUAAK1INZUoVUx8IEFJ5hJ0DBlGSG/ArdPobF
//caTpwwAewAOVYZZqIdXdsAEF8xKAApWRIetCt+ehD4/m8aQCHIADhSHqxTgxq53ixIiPY/f1YVD4FD6d
//DkkfhmjZP+XCSIVB24MBDsABOkDSg6GEA6eEgwocgAOmKJX8FwbaQBsRbe8FiAARKAZJ74USJOIj1ek4
//mIADcIBiUPJdmCoGHUQcei6ABJBAM0h6LpQw4dWAgGoACHQhtPwWpqpBCRIHXgsgASRQDXJeC4POhAEk
//PINMQIIJSB2fRbZ+hf4RpO2xAByAA3Uh57Ew6GJYQIJ5CCCButDxV2TrbWiDoxHA52ugATRQFnY5FwGN
//xHIutnt29FdQ/BQ/nQ3DnIvupd835+L5QGh6LEACSEAPGOZcpCDBqSGhAgkgganJHDkXUhpBHxNNrwWY
//ABMoB8OcixRQdPsP7LsgYQISQALKIUfOhbxy0MJE23MBKAAF2sEw5yIFFV4RCqgHoEB3IkvOhbx6UANF
//y3sBKAAF6sEs50KqY2ECCs+wE6BgQjJDzoVuH8PiONL0YAAP4IHKMMu5kOpu2ICCeQlAgcrIkHOh2/PQ
//h0fzeDIBHIADhWGVc5HixIiPY/f1YVD4FD6dDqOcC3kXRioM2h4McAAO0AFGORfyDox0HFTgABwwRWmf
//c2Hlvkg+PrS8FyACRKAYjHIu5J0X6TiYgANwgGKwz7mwcl2kIuLQcwEkgASawSjnQt5xIQEEVANAoAuR
//IefCym2RDIkDrwWQABKoBpOcCyunhQAkPINMQIIJSPOci7wui/QjSNtjATgAB+rCJOfCymEhAQnmIYAE
//6sI85yKvu+L54PgHk9ZsTw==
