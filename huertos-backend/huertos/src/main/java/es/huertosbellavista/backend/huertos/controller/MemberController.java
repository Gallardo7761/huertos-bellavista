package es.huertosbellavista.backend.huertos.controller;

import es.huertosbellavista.backend.huertos.common.TriTuple;
import es.huertosbellavista.backend.huertos.dto.DropdownDto;
import es.huertosbellavista.backend.huertos.dto.MemberDto;
import es.huertosbellavista.backend.huertos.dto.MemberProfileDto;
import es.huertosbellavista.backend.huertos.dto.WaitlistCensoredDto;
import es.huertosbellavista.backend.huertos.dto.*;
import es.huertosbellavista.backend.huertos.dto.view.VIncomesWithInfoDto;
import es.huertosbellavista.backend.huertos.security.HuertosPrincipal;
import es.huertosbellavista.backend.huertos.service.EmailExportService;
import es.huertosbellavista.backend.huertos.service.MemberService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/users")
public class MemberController {

    private final MemberService memberService;
    private final EmailExportService emailExportService;

    public MemberController(MemberService memberService, EmailExportService emailExportService) {
        this.memberService = memberService;
        this.emailExportService = emailExportService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<List<MemberDto>> getAll() {
        return ResponseEntity.ok(memberService.getAll());
    }

    @GetMapping("/me")
    public ResponseEntity<MemberProfileDto> getMe(Authentication authentication) {
        if (!(authentication.getPrincipal() instanceof HuertosPrincipal principal)) {
            throw new IllegalStateException("Tipo de autenticación inválida");
        }

        return ResponseEntity.ok(
            memberService.getMyProfile(principal.getUserId())
        );
    }

    @GetMapping("/dropdown")
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<List<DropdownDto>> getDropdown() {
        return ResponseEntity.ok(memberService.getDropdown());
    }

    @GetMapping("/{user_id:[0-9a-fA-F\\-]{36}}")
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<MemberDto> getById(@PathVariable("user_id") UUID userId) {
        return ResponseEntity.ok(memberService.getById(userId));
    }

    @GetMapping("/latest-number")
    public ResponseEntity<Integer> getLatestNumber() {
        return ResponseEntity.ok(memberService.getLatestMemberNumber());
    }

    @GetMapping("/waitlist")
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<List<MemberDto>> getWaitlist() {
        return ResponseEntity.ok(memberService.getWaitlist());
    }

    @GetMapping("/waitlist/limited")
    public ResponseEntity<List<WaitlistCensoredDto>> getWaitlistLimited() {
        return ResponseEntity.ok(memberService.getWaitlistLimited());
    }

    @GetMapping("/number/{member_number}")
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<MemberDto> getByMemberNumber(@PathVariable("member_number") Integer memberNumber) {
        return ResponseEntity.ok(memberService.getByMemberNumber(memberNumber));
    }

    @GetMapping("/number/{member_number}/incomes")
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<List<VIncomesWithInfoDto>> getMemberIncomes(@PathVariable("member_number") Integer memberNumber) {
        return ResponseEntity.ok(memberService.getIncomes(memberNumber));
    }

    @GetMapping("/number/{member_number}/has-paid")
    public ResponseEntity<Boolean> getMemberHasPaid(@PathVariable("member_number") Integer memberNumber) {
        return ResponseEntity.ok(memberService.hasPaid(memberNumber));
    }

    @GetMapping("/number/{member_number}/has-collaborator")
    public ResponseEntity<Boolean> getMemberHasCollaborator(@PathVariable("member_number") Integer memberNumber) {
        return ResponseEntity.ok(memberService.hasCollaborator(memberNumber));
    }

    @GetMapping("/number/{member_number}/has-greenhouse")
    public ResponseEntity<Boolean> getMemberHasGreenhouse(@PathVariable("member_number") Integer memberNumber) {
        return ResponseEntity.ok(memberService.hasGreenhouse(memberNumber));
    }

    @GetMapping("/number/{member_number}/has-collaborator-request")
    public ResponseEntity<Boolean> getMemberHasCollaboratorRequest(@PathVariable("member_number") Integer memberNumber) {
        return ResponseEntity.ok(memberService.hasCollaboratorRequest(memberNumber));
    }

    @GetMapping("/number/{member_number}/has-greenhouse-request")
    public ResponseEntity<Boolean> getMemberHasGreenhouseRequest(@PathVariable("member_number") Integer memberNumber) {
        return ResponseEntity.ok(memberService.hasGreenhouseRequest(memberNumber));
    }

    @GetMapping("/plot/{plot_number}")
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<MemberDto> getByPlotNumber(@PathVariable("plot_number") Integer plotNumber) {
        return ResponseEntity.ok(memberService.getByPlotNumber(plotNumber));
    }

    @GetMapping("/dni/{dni}")
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<MemberDto> getByDni(@PathVariable("dni") String dni) {
        return ResponseEntity.ok(memberService.getByDni(dni));
    }

    @GetMapping("/email/export")
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<byte[]> exportEmails(
        @RequestParam(name = "diffOnly", defaultValue = "false") boolean diffOnly
    ) {
        List<TriTuple<String, Integer, String>> allContacts = memberService.getAllContactsForEmail();

        List<TriTuple<String, Integer, String>> toExport;

        if (diffOnly) {
            List<String> lastEmails = emailExportService.loadLastSnapshot();
            toExport = emailExportService.getNewContacts(allContacts, lastEmails);
        } else {
            toExport = allContacts;
        }

        String csv = emailExportService.generateCsv(toExport);

        try {
            emailExportService.saveSnapshot(csv);
        } catch (IOException e) {
            throw new RuntimeException("Error exportando correos: " + e.getMessage());
        }

        return buildFileResponse(csv);
    }

    private ResponseEntity<byte[]> buildFileResponse(String csvContent) {
        byte[] is = csvContent.getBytes(StandardCharsets.UTF_8);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "emails.csv");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
        return new ResponseEntity<>(is, headers, HttpStatus.OK);
    }

    @PutMapping("/{user_id:[0-9a-fA-F\\-]{36}}")
    @PreAuthorize("hasAnyRole('HUERTOS_ROLE_ADMIN', 'HUERTOS_ROLE_DEV')")
    public ResponseEntity<MemberDto> update(
            @PathVariable("user_id") UUID userId,
            @RequestBody MemberDto changes
    ) {
        return ResponseEntity.ok(memberService.update(userId, changes));
    }
}