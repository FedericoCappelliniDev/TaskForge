@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    https://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM ----------------------------------------------------------------------------
@REM Apache Maven Wrapper startup batch script
@REM ----------------------------------------------------------------------------

@IF "%__MVNW_ARG0_NAME__%"=="" (SET __MVNW_ARG0_NAME__=%~nx0)
@SET __MVNW_CMD__=
@SET __MVNW_ERROR__=
@SET __MVNW_PWSH_CMD__=powershell
IF NOT x%PROCESSOR_ARCHITECTURE%==xARM64 (
  IF NOT x%PROCESSOR_ARCHITEW6432%==xARM64 (
    SET __MVNW_PWSH_CMD__=powershell
  )
)
@FOR /F "usebackq tokens=1* delims==" %%A IN (`"%__MVNW_PWSH_CMD__%" -noprofile -ExecutionPolicy Bypass -command "& {exit 0}"`) DO @(
  @REM PowerShell is available, use it
)
IF NOT ERRORLEVEL 1 (
  SET __MVNW_CMD__=%__MVNW_PWSH_CMD__% -noprofile -ExecutionPolicy Bypass -file "%~dp0.mvn\wrapper\MavenWrapperDownloader.ps1"
)
IF x%__MVNW_CMD__%==x (
  ECHO "PowerShell required for Maven Wrapper download." 1>&2
  EXIT /B 1
)

SET MAVEN_PROJECTBASEDIR=%~dp0
IF NOT "%MAVEN_BASEDIR%"=="" SET MAVEN_PROJECTBASEDIR=%MAVEN_BASEDIR%

@SET WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain
@SET DOWNLOAD_URL="https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.3.2/maven-wrapper-3.3.2.jar"

SET WRAPPER_JAR="%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"
IF NOT EXIST %WRAPPER_JAR% (
  %__MVNW_CMD__% %DOWNLOAD_URL% %WRAPPER_JAR%
)

@SET JAVA_EXE=%JAVA_HOME%/bin/java.exe
IF NOT EXIST "%JAVA_EXE%" (
  FOR /F "tokens=*" %%F IN ('where java 2^>nul') DO (
    SET JAVA_EXE=%%F
    GOTO :java_found
  )
  ECHO Error: JAVA_HOME is not set and java could not be found in PATH. 1>&2
  EXIT /B 1
)
:java_found

@SET WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain
@SET CLASSWORLDS_CONF=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.properties
"%JAVA_EXE%" ^
  "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" ^
  "-Dmaven.wrapper.propertiesFile=%CLASSWORLDS_CONF%" ^
  "-classpath" "%WRAPPER_JAR%" ^
  %WRAPPER_LAUNCHER% %*
