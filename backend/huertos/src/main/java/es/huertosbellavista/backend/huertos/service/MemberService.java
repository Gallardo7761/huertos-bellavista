    package es.huertosbellavista.backend.huertos.service;

    import es.huertosbellavista.backend.huertos.client.HuertosWebClient;
    import es.huertosbellavista.backend.huertos.dto.*;
    import es.huertosbellavista.backend.huertos.dto.*;
    import es.huertosbellavista.backend.huertos.dto.view.VIncomesWithInfoDto;
    import es.huertosbellavista.backend.huertos.mapper.DropdownDtoMapper;
    import es.huertosbellavista.backend.huertos.mapper.RequestMapper;
    import es.huertosbellavista.backend.huertos.mapper.UserMetadataMapper;
    import es.huertosbellavista.backend.huertos.mapper.view.VIncomesWithInfoMapper;
    import es.huertosbellavista.backend.huertos.security.NameCensorer;
    import net.miarma.backlib.dto.UserWithCredentialDto;
    import net.miarma.backlib.exception.NotFoundException;
    import org.springframework.cache.annotation.CacheEvict;
    import org.springframework.cache.annotation.Cacheable;
    import org.springframework.stereotype.Service;

    import java.util.Comparator;
    import java.util.List;
    import java.util.UUID;

    @Service
    public class MemberService {
        private final HuertosWebClient huertosWebClient;
        private final IncomeService incomeService;
        private final RequestService requestService;
        private final UserMetadataService metadataService;

        public MemberService(HuertosWebClient huertosWebClient,
                             IncomeService incomeService,
                             RequestService requestService,
                             UserMetadataService metadataService) {
            this.huertosWebClient = huertosWebClient;
            this.incomeService = incomeService;
            this.requestService = requestService;
            this.metadataService = metadataService;
        }

        @Cacheable(value = "memberById")
        public MemberDto getById(UUID userId) {
            var uwc = huertosWebClient.getUserWithCredential(userId, (byte)1);
            if (uwc == null) {
                throw new NotFoundException("Socio no encontrado");
            }

            var meta = metadataService.getById(userId);
            if (meta == null) {
                throw new NotFoundException("User metadata not found");
            }

            return new MemberDto(
                    uwc.user(),
                    uwc.account(),
                    UserMetadataMapper.toDto(meta)
            );
        }

        @Cacheable("members")
        public List<MemberDto> getAll() {
            List<UserWithCredentialDto> all = huertosWebClient.getAllUsersWithCredentials((byte)1);

            return all.stream()
                    .filter(uwc -> metadataService.existsById(uwc.user().getUserId()))
                .map(uwc -> {
                    var meta = metadataService.getById(uwc.user().getUserId());
                    return new MemberDto(
                        uwc.user(),
                        uwc.account(),
                        UserMetadataMapper.toDto(meta)
                    );
                })
                .sorted(Comparator.comparing(dto -> dto.metadata().getMemberNumber()))
                .toList();
        }

        public MemberProfileDto getMyProfile(UUID userId) {
            MemberDto member = getById(userId);
            Integer memberNumber = member.metadata().getMemberNumber();

            List<RequestDto.Response> requests = requestService.getByUserId(userId).stream()
                    .map(RequestMapper::toResponse)
                    .toList();

            List<VIncomesWithInfoDto> payments = incomeService.getByMemberNumber(memberNumber).stream()
                    .map(VIncomesWithInfoMapper::toResponse)
                    .toList();

            return new MemberProfileDto(
                    member.user(),
                    member.account(),
                    member.metadata(),
                    requests,
                    payments,
                    hasCollaborator(memberNumber),
                    hasGreenhouse(memberNumber),
                    hasCollaboratorRequest(memberNumber),
                    hasGreenhouseRequest(memberNumber)
            );
        }

        public Integer getLatestMemberNumber() {
            return metadataService.getLatestMemberNumber();
        }

        @Cacheable("waitlist")
        public List<MemberDto> getWaitlist() {
            List<UserWithCredentialDto> all = huertosWebClient.getAllUsersWithCredentials((byte)1);

            return all.stream()
                    .filter(uwc -> metadataService.existsById(uwc.user().getUserId()))
                    .filter(uwc -> uwc.account().getStatus() != 0)
                    .map(uwc -> {
                        var meta = metadataService.getById(uwc.user().getUserId());
                        return new MemberDto(uwc.user(), uwc.account(),
                                UserMetadataMapper.toDto(meta));
                    })
                    .filter(dto -> dto.metadata().getType().equals((byte) 0))
                    .sorted(Comparator.comparing(dto -> dto.metadata().getCreatedAt()))
                    .toList();
        }

        public List<WaitlistCensoredDto> getWaitlistLimited() {
            return getWaitlist().stream()
                .map(dto -> {
                    WaitlistCensoredDto censored = new WaitlistCensoredDto();
                    censored.setName(NameCensorer.censor(dto.user().getDisplayName()));
                    return censored;
                })
                .toList();
        }

        public MemberDto getByMemberNumber(Integer memberNumber) {
            return getAll().stream()
                    .filter(dto -> dto.metadata().getMemberNumber().equals(memberNumber))
                    .findFirst()
                    .orElseThrow(() -> new NotFoundException("No hay socio con ese número"));
        }

        public MemberDto getByPlotNumber(Integer plotNumber) {
            return getAll().stream()
                    .filter(dto -> dto.metadata().getPlotNumber().equals(plotNumber))
                    .findFirst()
                    .orElseThrow(() -> new NotFoundException("No hay socio con ese huerto"));
        }

        public MemberDto getByDni(String dni) {
            return getAll().stream()
                    .filter(dto -> dni.equals(dto.metadata().getDni()))
                    .findFirst()
                    .orElseThrow(() -> new NotFoundException("No hay socio con ese DNI"));
        }

        public List<VIncomesWithInfoDto> getIncomes(Integer memberNumber) {
            return incomeService.getByMemberNumber(memberNumber).stream()
                    .map(VIncomesWithInfoMapper::toResponse)
                    .toList();
        }

        public Boolean hasPaid(Integer memberNumber) {
            return incomeService.hasPaid(memberNumber);
        }

        public Boolean hasCollaborator(Integer memberNumber) {
            List<MemberDto> all = getAll();

            var member = all.stream()
                    .filter(dto -> dto.metadata().getMemberNumber().equals(memberNumber))
                    .findFirst()
                    .orElse(null);

            if (member == null) return false;

            Integer plotNumber = member.metadata().getPlotNumber();
            if (plotNumber == null) return false;

            List<MemberDto> plotMembers = all.stream()
                    .filter(dto -> plotNumber.equals(dto.metadata().getPlotNumber()))
                    .toList();

            return plotMembers.stream()
                    .anyMatch(dto -> dto.metadata().getType().equals((byte)3) ||
                            dto.metadata().getType().equals((byte)0));
        }

        public Boolean hasGreenhouse(Integer memberNumber) {
            return metadataService.getByMemberNumber(memberNumber).getType().equals((byte)2);
        }

        public Boolean hasCollaboratorRequest(Integer memberNumber) {
            UUID userId = metadataService.getByMemberNumber(memberNumber).getUserId();
            return requestService.hasCollaboratorRequest(userId);
        }

        public Boolean hasGreenhouseRequest(Integer memberNumber) {
            UUID userId = metadataService.getByMemberNumber(memberNumber).getUserId();
            return requestService.hasGreenhouseRequest(userId);
        }

        public List<DropdownDto> getDropdown() {
            return getAll().stream()
                .map(DropdownDtoMapper::toDto)
                .toList();
        }

        @CacheEvict(value = "members", allEntries = true)
        public MemberDto update(UUID userId, MemberDto changes) {
            try {
                huertosWebClient.updateUser(userId, new UserWithCredentialDto(changes.user(), changes.account()));
                metadataService.update(userId, UserMetadataMapper.fromDto(changes.metadata()));
            } catch (Exception e) {
                throw new RuntimeException("No se pudo actualizar el socio");
            }
            return changes;
        }
    }
